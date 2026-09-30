#!/usr/bin/env node
// Skyline — deterministic checker and lifecycle CLI for Skyline spec artifacts.
// Zero dependencies, Node >= 18. The same file is vendored into each repo as .skyline/skyline.mjs,
// so CI and the owner can run it without the plugin.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const VERSION = '0.3.2';

// ─── Model ──────────────────────────────────────────────────────────────────────────────────────
// parents: allowed parent types · required: a parent pin is mandatory · gated: the owner approves it.

export const TYPES = {
  SRC: { dir: 'src', parents: [], required: false, gated: true, codes: [], min: {} },
  BRIEF: { dir: 'brief', parents: [], required: false, gated: true, codes: ['G', 'NG', 'A', 'C', 'K', 'ASM', 'RISK'], min: { G: 1, C: 1 } },
  SPEC: { dir: 'spec', parents: ['BRIEF'], required: false, gated: true, codes: ['T', 'DF', 'S', 'X', 'R', 'P', 'F', 'AC', 'N', 'ASM'], min: { R: 1, AC: 1 } },
  DSN: { dir: 'design', parents: ['SPEC'], required: true, gated: true, codes: ['CMP', 'DM', 'API', 'RZ', 'DEC', 'IC', 'RISK'], min: { CMP: 1 } },
  PLAN: { dir: 'plan', parents: ['SPEC', 'DSN'], required: true, gated: false, codes: ['CMP', 'DM', 'API', 'RZ', 'DEC', 'TK', 'RISK'], min: { TK: 1 } },
};
export const TYPE_NAMES = Object.keys(TYPES);
export const FLOWS = ['feature', 'project', 'adopt'];
export const STATUSES = ['draft', 'approved', 'superseded', 'rejected'];
export const FINAL = new Set(['superseded', 'rejected']);
export const LOCKED = new Set(['approved', 'superseded', 'rejected']);
export const HUMAN_ONLY = ['approve', 'upgrade'];

const ALL_CODES = [...new Set(Object.values(TYPES).flatMap((t) => t.codes))].sort((a, b) => b.length - a.length);
const CODE_ALT = ALL_CODES.join('|');
const TYPE_ALT = TYPE_NAMES.join('|');

export const RE = {
  artifactId: new RegExp(`^(${TYPE_ALT})-(\\d+)$`),
  artifactFile: new RegExp(`^(${TYPE_ALT})-(\\d+)(?:[-.].*)?\\.md$`),
  revisionFile: /\.rev\.md$/,
  code: new RegExp(`^(${CODE_ALT})-(\\d{2,3})$`),
  qref: new RegExp(`\\b(${TYPE_ALT})-(\\d+)/(${CODE_ALT})-(\\d{2,3})\\b`, 'g'),
  cite: /\bSRC-(\d+)#L(\d+)(?:-L?(\d+))?\b/g,
  codeCite: /\bcode:([\w./@+-]+?)#L(\d+)(?:-L?(\d+))?\b/g,
  aref: new RegExp(`\\b(${TYPE_ALT})-(\\d+)\\b(?![/#@\\d-])`, 'g'),
  lref: new RegExp(`(?<![\\w/-])(${CODE_ALT})-(\\d{2,3})\\b(?!-)`, 'g'),
  marker: /\[CLARIFY:[^\]]*\]/g,
  forbidden: /\b(TBD|TODO|FIXME)\b|\?\?\?/g,
  pin: /^((?:[A-Z]+)-\d+)@(\d+\.\d+\.\d+)$/,
  semver: /^\d+\.\d+\.\d+$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
};

export const DEFAULT_CONFIG = {
  root: 'specs',
  project: '',
  owner: '',
  testDirs: ['src', 'test', 'tests', 'apps', 'libs', 'packages'],
  testPattern: '\\.(test|spec|e2e-spec)\\.[cm]?[jt]sx?$',
  vagueWords: [
    'etc', 'and so on', 'as needed', 'as appropriate', 'appropriate', 'user-friendly', 'fast', 'quickly',
    'easy', 'easily', 'flexible', 'some', 'several', 'various', 'usually', 'normally', 'generally', 'should',
    'and/or', 'if possible', 'reasonable', 'sufficient', 'robust',
    'v.v', 'vân vân', 'phù hợp', 'thân thiện', 'nhanh', 'linh hoạt', 'một số', 'thường', 'nói chung', 'nên',
    'hợp lý', 'tương đối', 'khoảng', 'đầy đủ',
  ],
};

export class CliError extends Error {
  constructor(msg, code = 2) {
    super(msg);
    this.exit = code;
  }
}

// ─── Small helpers ──────────────────────────────────────────────────────────────────────────────

export const isBlank = (v) => v == null || /^\s*(|—|–|-|~|null)\s*$/i.test(String(v));
const normKey = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
export const prefixOf = (code) => code.slice(0, code.lastIndexOf('-'));
export function normCode(prefix, num) {
  return `${prefix}-${String(Number(num)).padStart(2, '0')}`;
}
const uniq = (xs) => [...new Set(xs)];
const toPosix = (p) => p.split(path.sep).join('/');
const today = () => new Date().toISOString().slice(0, 10);
const trunc = (s, n = 72) => {
  s = String(s || '').replace(/\s+/g, ' ').trim();
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
};
function cmpVer(a, b) {
  const x = a.split('.').map(Number);
  const y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  return 0;
}
const majorMinor = (v) => v.split('.').slice(0, 2).join('.');
const levelOf = (from, to) => (from.split('.')[0] !== to.split('.')[0] ? 'major' : majorMinor(from) !== majorMinor(to) ? 'minor' : 'patch');
export function bump(v, level) {
  const [a, b, c] = v.split('.').map(Number);
  if (level === 'major') return `${a + 1}.0.0`;
  if (level === 'minor') return `${a}.${b + 1}.0`;
  return `${a}.${b}.${c + 1}`;
}
export function slugify(s) {
  return (
    String(s)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'untitled'
  );
}
export function inside(child, parent) {
  const r = path.relative(parent, child);
  return r === '' || (!r.startsWith('..') && !path.isAbsolute(r));
}
function walk(dir, out = []) {
  let ents;
  try {
    ents = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of ents) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile()) out.push(p);
  }
  return out;
}

// ─── Repo and config ────────────────────────────────────────────────────────────────────────────

export function findRepo(start) {
  let d = path.resolve(start || process.cwd());
  for (;;) {
    const c = path.join(d, '.skyline', 'config.json');
    if (fs.existsSync(c)) {
      let config;
      try {
        config = JSON.parse(fs.readFileSync(c, 'utf8'));
      } catch (e) {
        throw new CliError(`cannot parse ${c}: ${e.message}`);
      }
      return { dir: d, config: { ...DEFAULT_CONFIG, ...config } };
    }
    const p = path.dirname(d);
    if (p === d) return null;
    d = p;
  }
}

function requireRepo() {
  const repo = findRepo(process.cwd());
  if (!repo) throw new CliError('no .skyline/config.json found here or above. Run `skyline init` in the repo root first.');
  return repo;
}

// ─── Parsing ────────────────────────────────────────────────────────────────────────────────────

export function parseFrontmatter(text) {
  const lines = text.split('\n');
  if ((lines[0] || '').replace(/\r$/, '').replace(/^﻿/, '') !== '---') return { fm: null, fmLines: {}, end: 0 };
  const fm = {};
  const fmLines = {};
  for (let i = 1; i < lines.length; i++) {
    const l = lines[i].replace(/\r$/, '');
    if (l === '---') return { fm, fmLines, end: i + 1 };
    const m = l.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (m) {
      let v = m[2].trim();
      if (/^".*"$/.test(v) || /^'.*'$/.test(v)) v = v.slice(1, -1);
      fm[m[1]] = v;
      fmLines[m[1]] = i + 1;
    }
  }
  return { fm: null, fmLines: {}, end: 0 };
}

export function parseList(v) {
  if (isBlank(v)) return [];
  let s = String(v).trim();
  if (s.startsWith('[') && s.endsWith(']')) s = s.slice(1, -1);
  return s
    .split(',')
    .map((x) => x.trim().replace(/^["']|["']$/g, ''))
    .filter((x) => !isBlank(x));
}

function splitCells(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  const cells = [];
  let cur = '';
  let tick = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '\\' && s[i + 1] === '|') {
      cur += '|';
      i++;
      continue;
    }
    if (ch === '`') tick = !tick;
    if (ch === '|' && !tick) {
      cells.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}
const isSepRow = (cells) => cells.length > 0 && cells.every((c) => /^:?-{3,}:?$/.test(c));

function stripComments(line, st) {
  let out = '';
  let i = 0;
  while (i < line.length) {
    if (st.in) {
      const e = line.indexOf('-->', i);
      if (e < 0) return out;
      st.in = false;
      i = e + 3;
      continue;
    }
    const s = line.indexOf('<!--', i);
    if (s < 0) {
      out += line.slice(i);
      break;
    }
    out += line.slice(i, s);
    st.in = true;
    i = s + 4;
  }
  return out;
}
const stripInlineCode = (s) => s.replace(/`[^`]*`/g, '');
const hasMarker = (s) => /\[CLARIFY:[^\]]*\]/.test(String(s || ''));

export function refsIn(text) {
  const t = String(text || '');
  const q = [...t.matchAll(RE.qref)].map((m) => ({
    art: `${m[1]}-${Number(m[2])}`,
    code: normCode(m[3], m[4]),
    raw: m[0],
  }));
  const c = [...t.matchAll(RE.cite)].map((m) => ({
    art: `SRC-${Number(m[1])}`,
    from: Number(m[2]),
    to: Number(m[3] || m[2]),
    raw: m[0],
  }));
  const l = [...t.matchAll(RE.lref)].map((m) => ({ code: normCode(m[1], m[2]), raw: m[0] }));
  const a = [...t.matchAll(RE.aref)].map((m) => ({ art: `${m[1]}-${Number(m[2])}`, raw: m[0] }));
  const k = [...t.matchAll(RE.codeCite)].map((m) => ({ file: m[1], from: Number(m[2]), to: Number(m[3] || m[2]), raw: m[0] }));
  return { q, c, l, a, k };
}

export function parseArtifact(abs, rel, text) {
  const { fm, fmLines, end } = parseFrontmatter(text);
  const lines = text.split('\n').map((l) => l.replace(/\r$/, ''));
  const a = {
    abs, rel, text, lines, fm, fmLines, bodyStart: end,
    id: null, type: null, num: 0, status: fm?.status, version: fm?.version,
    tables: [], defs: new Map(), defList: [], dupDefs: [], markers: [], forbidden: [], mentions: [], vagueText: [],
  };
  if (!fm) return a;
  const m = RE.artifactId.exec(fm.id || '');
  if (m) {
    a.type = m[1];
    a.num = Number(m[2]);
    a.id = `${m[1]}-${a.num}`;
  }
  const st = { in: false };
  let fence = false;
  let table = null;
  let decision = null;
  let heading = null;
  let history = false;
  for (let i = end; i < lines.length; i++) {
    const raw = lines[i];
    const ln = i + 1;
    for (const mm of raw.matchAll(RE.marker)) a.markers.push({ line: ln, text: mm[0] });
    const dec = raw.match(/<!--\s*decision:\s*([A-Z]+-\d{2,3})\s*-->/);
    const clean = stripComments(raw, st);
    if (/^\s*(```|~~~)/.test(clean)) {
      fence = !fence;
      table = null;
      continue;
    }
    if (/^##\s+/.test(clean) && !fence) history = /^##\s+(\d+\.\s*)?change log\s*$/i.test(clean.trim());
    if (history) {
      table = null;
      heading = null;
      continue;
    }
    if (clean.trim()) a.mentions.push({ line: ln, text: clean });
    if (fence) continue;
    for (const mm of stripInlineCode(clean).matchAll(RE.forbidden)) a.forbidden.push({ line: ln, text: mm[0] });
    if (dec) {
      decision = { rule: dec[1], line: ln };
      table = null;
      continue;
    }
    if (/^##\s+/.test(clean)) {
      table = null;
      heading = null;
      decision = null;
      continue;
    }
    const h3 = clean.match(/^###\s+(\S+)\s*(.*)$/);
    if (h3) {
      table = null;
      decision = null;
      heading = null;
      const cm = RE.code.exec(h3[1]);
      if (cm) {
        const d = { code: normCode(cm[1], cm[2]), line: ln, kind: 'heading', title: h3[2].trim(), body: [] };
        addDef(a, d);
        heading = d;
      }
      continue;
    }
    if (clean.trim().startsWith('|')) {
      const cells = splitCells(clean);
      if (!table) {
        table = { header: cells, keys: cells.map(normKey), rows: [], line: ln, decision };
        decision = null;
        a.tables.push(table);
        continue;
      }
      if (isSepRow(cells)) continue;
      const row = { cells, line: ln, table };
      table.rows.push(row);
      const idx = /^\[[ xX]?\]$/.test(cells[0] || '') ? 1 : 0;
      const cm = RE.code.exec(cells[idx] || '');
      if (cm) {
        const d = { code: normCode(cm[1], cm[2]), line: ln, kind: 'row', cells, codeIdx: idx, table, row };
        row.def = d;
        addDef(a, d);
      }
      continue;
    }
    table = null;
    if (clean.trim()) {
      decision = null;
      if (heading) heading.body.push({ line: ln, text: clean });
    }
  }
  return a;
}

function addDef(a, d) {
  if (a.defs.has(d.code)) a.dupDefs.push(d);
  else a.defs.set(d.code, d);
  a.defList.push(d);
}

export function defText(d) {
  if (d.kind === 'row') return d.cells.filter((_, i) => i !== d.codeIdx).join(' | ');
  return [d.title, ...d.body.map((b) => b.text)].join('\n');
}
export function defSummary(d) {
  if (d.kind === 'heading') return trunc(d.title);
  const p = prefixOf(d.code);
  if (p === 'X') return trunc(`${cellOf(d, 'from')} —${cellOf(d, 'event')}→ ${cellOf(d, 'to')}${isBlank(cellOf(d, 'guard')) ? '' : ` [${cellOf(d, 'guard')}]`}`);
  if (p === 'S') return trunc(`${cellOf(d, 'machine')}.${cellOf(d, 'state')} (${cellOf(d, 'kind')})`);
  const c = d.cells.slice(d.codeIdx + 1).find((x) => !isBlank(x));
  return trunc(c || '');
}
const col = (t, ...names) => {
  for (const n of names) {
    const i = t.keys.indexOf(normKey(n));
    if (i >= 0) return i;
  }
  return -1;
};
const cellOf = (d, name) => {
  if (d.kind !== 'row') return '';
  const i = col(d.table, name);
  return i >= 0 ? d.cells[i] || '' : '';
};


export function normId(s) {
  const m = String(s || '').trim().match(new RegExp(`^(${TYPE_ALT})-0*(\\d+)$`, 'i'));
  return m ? `${m[1].toUpperCase()}-${Number(m[2])}` : null;
}

// ─── Git ────────────────────────────────────────────────────────────────────────────────────────

export function gitHelper(dir) {
  const run = (args) => {
    try {
      return execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
    } catch {
      return null;
    }
  };
  const ok = run(['rev-parse', '--is-inside-work-tree']) !== null;
  const cache = new Map();
  return {
    ok,
    run,
    commit: (sha) => run(['cat-file', '-e', `${sha}^{commit}`]) !== null,
    head: () => (run(['rev-parse', '--short', 'HEAD']) || '').trim() || null,
    file: (sha, file) => {
      const k = `${sha}:./${file}`;
      if (!cache.has(k)) {
        const out = run(['show', k]);
        cache.set(k, out === null ? null : out.replace(/\n$/, '').split('\n'));
      }
      return cache.get(k);
    },
  };
}

/** Artifact files present on every local and remote-tracking branch (used for id allocation and --branches). */
export function branchArtifacts(repo, git) {
  if (!git.ok) return { refs: 0, files: [] };
  const refs = (git.run(['for-each-ref', '--format=%(refname:short)', 'refs/heads', 'refs/remotes']) || '')
    .split('\n').map((s) => s.trim()).filter((r) => r && !r.endsWith('/HEAD') && r !== 'HEAD').slice(0, 300);
  const files = [];
  for (const ref of refs) {
    const ls = git.run(['ls-tree', '-r', '--name-only', ref, '--', repo.config.root]) || '';
    for (const f of ls.split('\n')) {
      if (f.startsWith(`${repo.config.root.replace(/\/+$/, '')}/review/`)) continue;
      const base = path.posix.basename(f.trim());
      const m = RE.artifactFile.exec(base);
      if (m && !RE.revisionFile.test(base)) files.push({ ref, type: m[1], num: Number(m[2]), id: `${m[1]}-${Number(m[2])}`, base });
    }
  }
  return { refs: refs.length, files };
}
// ─── Row schema ─────────────────────────────────────────────────────────────────────────────────
// Columns every row of a given item type must have. A table whose header lacks one is an error (C07):
// the checker no longer skips a contract because its column is missing.

export const SCHEMA = {
  G: ['Goal', 'Success measure', 'Source'], NG: ['Non-goal', 'Source'], A: ['Actor', 'Source'], C: ['Capability', 'Source'],
  K: ['Constraint', 'Source'], ASM: ['Assumption', 'Validate by'], RISK: ['Risk', 'Mitigation'],
  T: ['Term', 'Definition', 'Source'], DF: ['Field', 'Type', 'Source'], S: ['Machine', 'State', 'Kind'],
  X: ['From', 'Event', 'Guard', 'To'], R: ['Rule', 'Source'], P: ['Action'], AC: ['Given', 'When', 'Then', 'Covers'],
  N: ['Quality', 'Target', 'Source'], CMP: ['Component', 'Path'], DM: ['Spec field', 'Storage'], API: ['Operation', 'Covers'],
  RZ: ['Spec rule', 'Component', 'Enforcement'], DEC: ['Question', 'Options', 'Chosen', 'Source'], IC: ['Constraint', 'Source'],
  TK: ['Task', 'Covers', 'Files'],
};

// ─── Guard analysis ─────────────────────────────────────────────────────────────────────────────
// Guards in this small language can be compared exactly:
//   balance >= 2 · total < 500000 · paid · not paid · role = manager · role != hr · R-05 · not R-05
//   joined with "and". Anything else is reported as not machine-verified (M09), never as fine.

export function parseGuard(text) {
  const g = String(text || '').trim();
  if (isBlank(g)) return { ok: true, atoms: [] };
  const atoms = [];
  for (const raw of g.split(/\s+and\s+|\s*&&\s*/i)) {
    const part = raw.trim().replace(/^\((.*)\)$/, '$1').trim();
    let m;
    const vname = (v) => v.trim().toLowerCase().replace(/\s+/g, '_');
    if ((m = part.match(/^(not\s+|!\s*)?(R-\d{2,3})(\s+holds|\s+does not hold)?$/i))) {
      const neg = Boolean(m[1]) !== Boolean(m[3] && /not/i.test(m[3]));
      atoms.push({ v: normCode('R', m[2].slice(2)), kind: 'bool', val: !neg });
    } else if ((m = part.match(/^([a-z_][\w .]*?)\s*(>=|<=|≥|≤|==|!=|=|>|<)\s*(-?\d+(?:\.\d+)?)$/i))) {
      const op = { '≥': '>=', '≤': '<=', '==': '=' }[m[2]] || m[2];
      const n = Number(m[3]);
      const decimals = (m[3].split('.')[1] || '').replace(/0+$/, '').length;
      // Only numbers a double holds exactly enough to compare: safe integers, or up to 6 decimals below 1e9.
      if (Number.isInteger(n) ? !Number.isSafeInteger(n) : decimals > 6 || Math.abs(n) >= 1e9)
        return { ok: false, reason: `the number ${m[3]} is outside the range the checker compares exactly (integers up to ${Number.MAX_SAFE_INTEGER}, or up to 6 decimals below 1e9)` };
      atoms.push({ v: vname(m[1]), kind: 'num', op, n });
    } else if ((m = part.match(/^([a-z_][\w .]*?)\s*(==|!=|=|\bis not\b|\bis\b)\s*([a-z_][\w-]*)$/i))) {
      const neg = /!=|not/i.test(m[2]);
      atoms.push({ v: vname(m[1]), kind: 'eq', val: m[3].toLowerCase(), neg });
    } else if ((m = part.match(/^(not\s+|!\s*)?([a-z_]\w*)$/i))) {
      atoms.push({ v: vname(m[2]), kind: 'bool', val: !m[1] });
    } else return { ok: false };
  }
  return { ok: true, atoms };
}

/** Can both guards hold at once? Returns { overlap, witness } or { unknown: true }. Numbers range over the reals. */
export function guardsOverlap(g1, g2) {
  const byVar = new Map();
  for (const a of [...g1.atoms, ...g2.atoms]) {
    if (!byVar.has(a.v)) byVar.set(a.v, []);
    byVar.get(a.v).push(a);
  }
  const witness = [];
  for (const [v, list] of byVar) {
    const kinds = new Set(list.map((a) => a.kind));
    if (kinds.size > 1) return { unknown: true };
    const kind = list[0].kind;
    if (kind === 'bool') {
      if (new Set(list.map((a) => a.val)).size > 1) return { overlap: false };
      witness.push(list[0].val ? v : `not ${v}`);
    } else if (kind === 'eq') {
      const pos = uniq(list.filter((a) => !a.neg).map((a) => a.val));
      const neg = new Set(list.filter((a) => a.neg).map((a) => a.val));
      if (pos.length > 1 || (pos.length === 1 && neg.has(pos[0]))) return { overlap: false };
      witness.push(pos.length ? `${v} = ${pos[0]}` : `${v} = (another value)`);
    } else {
      let lo = -Infinity, loInc = false, hi = Infinity, hiInc = false;
      const excl = [];
      for (const a of list) {
        if (a.op === '>=' || a.op === '>' || a.op === '=') if (a.n > lo || (a.n === lo && a.op === '>')) { lo = a.n; loInc = a.op !== '>'; }
        if (a.op === '<=' || a.op === '<' || a.op === '=') if (a.n < hi || (a.n === hi && a.op === '<')) { hi = a.n; hiInc = a.op !== '<'; }
        if (a.op === '!=') excl.push(a.n);
      }
      if (lo > hi || (lo === hi && !(loInc && hiInc)) || (lo === hi && excl.includes(lo))) return { overlap: false };
      // A bounded set of candidates: with k excluded values, k + 2 distinct points inside the interval
      // always leave one that is not excluded. No open-ended search.
      const k = excl.length + 2;
      const cands = [];
      if (loInc && lo !== -Infinity) cands.push(lo);
      if (hiInc && hi !== Infinity) cands.push(hi);
      if (lo !== -Infinity) cands.push(Math.floor(lo) + 1);
      if (hi !== Infinity) cands.push(Math.ceil(hi) - 1);
      if (lo !== -Infinity && hi !== Infinity) cands.push((lo + hi) / 2);
      for (let i = 1; i <= k; i++)
        cands.push(lo === -Infinity ? (hi === Infinity ? i - 1 : hi - i) : hi === Infinity ? lo + i : lo + ((hi - lo) * i) / (k + 1));
      const w = cands.find((x) => Number.isFinite(x) && (x > lo || (loInc && x === lo)) && (x < hi || (hiInc && x === hi)) && !excl.includes(x));
      if (w === undefined) return { unknown: true };
      witness.push(`${v} = ${w}`);
    }
  }
  return { overlap: true, witness: witness.join(', ') || 'always' };
}

/** Can this guard hold at all? { overlap: false } means it is a contradiction. */
export const guardSatisfiable = (g) => guardsOverlap(g, { ok: true, atoms: [] });

// ─── Test titles and test results ───────────────────────────────────────────────────────────────
// An AC counts as linked only when its code sits in the title of a test call that is not skipped
// (it/test/describe...). Comments and plain strings do not count. Whether it passed comes only from
// a results file: JUnit XML, or Jest / Vitest / Mocha JSON.

// A small lexer for JS/TS test files: comments are blanked, string and template literals are recorded
// and blanked, regex literals are skipped. Test calls are then found in code only, never in comments
// or inside other strings.
const REGEX_AFTER_WORD = new Set(['return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new', 'delete', 'void', 'throw', 'instanceof', 'yield', 'await']);

export function lexSource(text) {
  const n = text.length;
  const out = text.split('');
  const strings = [];
  const blank = (a, b) => {
    for (let k = a; k < b && k < n; k++) if (out[k] !== '\n') out[k] = ' ';
  };
  const stack = [];
  let depth = 0;
  let prev = '';
  let word = '';
  const template = (from, start) => {
    let j = from;
    while (j < n) {
      const ch = text[j];
      if (ch === '\\') {
        j += 2;
        continue;
      }
      if (ch === '`') {
        blank(from, j);
        strings.push({ start, end: j + 1, quote: '`', value: text.slice(start + 1, j) });
        return { end: j + 1, open: false };
      }
      if (ch === '$' && text[j + 1] === '{') {
        blank(from, j);
        return { end: j + 2, open: true };
      }
      j++;
    }
    blank(from, n);
    return { end: n, open: false };
  };
  let i = 0;
  while (i < n) {
    const c = text[i];
    const d = text[i + 1];
    if (c === '/' && d === '/') {
      let e = text.indexOf('\n', i);
      if (e < 0) e = n;
      blank(i, e);
      i = e;
      continue;
    }
    if (c === '/' && d === '*') {
      let e = text.indexOf('*/', i + 2);
      e = e < 0 ? n : e + 2;
      blank(i, e);
      i = e;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && text[j] !== c && text[j] !== '\n') j += text[j] === '\\' ? 2 : 1;
      const end = Math.min(j + 1, n);
      strings.push({ start: i, end, quote: c, value: text.slice(i + 1, Math.min(j, n)) });
      blank(i + 1, j);
      i = end;
      prev = 'str';
      continue;
    }
    if (c === '`') {
      const r = template(i + 1, i);
      if (r.open) stack.push({ start: i, depth: depth++ });
      i = r.end;
      prev = r.open ? 'op' : 'str';
      continue;
    }
    if (c === '{') {
      depth++;
      prev = 'op';
      i++;
      continue;
    }
    if (c === '}') {
      depth--;
      const top = stack[stack.length - 1];
      if (top && depth === top.depth) {
        const r = template(i + 1, top.start);
        if (r.open) depth++;
        else stack.pop();
        i = r.end;
        prev = r.open ? 'op' : 'str';
        continue;
      }
      prev = '}';
      i++;
      continue;
    }
    if (c === '/' && (prev === '' || prev === 'op' || (prev === 'id' && REGEX_AFTER_WORD.has(word)))) {
      let j = i + 1;
      let cls = false;
      while (j < n && text[j] !== '\n') {
        if (text[j] === '\\') j++;
        else if (text[j] === '[') cls = true;
        else if (text[j] === ']') cls = false;
        else if (text[j] === '/' && !cls) break;
        j++;
      }
      j++;
      while (j < n && /[a-z]/i.test(text[j])) j++;
      blank(i, j);
      i = j;
      prev = 'str';
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i + 1;
      while (j < n && /[\w$]/.test(text[j])) j++;
      word = text.slice(i, j);
      prev = 'id';
      i = j;
      continue;
    }
    if (/\d/.test(c)) {
      let j = i + 1;
      while (j < n && /[\w.]/.test(text[j])) j++;
      prev = 'num';
      i = j;
      continue;
    }
    if (!/\s/.test(c)) prev = c === ')' ? ')' : c === ']' ? ']' : 'op';
    i++;
  }
  return { code: out.join(''), strings };
}

const TEST_NAME = /\b(it|test|describe|context|suite|specify|scenario|xit|xtest|xdescribe|xcontext|xspecify|fit|ftest|fdescribe|fcontext)\b/g;
const SKIP_MOD = new Set(['skip', 'todo', 'fixme', 'skipIf']);

/** Test calls in one file: title, whether it is skipped (itself or by an enclosing skipped suite, or by .only elsewhere in the file). */
export function testCalls(text) {
  const { code, strings } = lexSource(text);
  const strAt = new Map(strings.map((s) => [s.start, s]));
  const closeOf = (open) => {
    let dep = 0;
    for (let k = open; k < code.length; k++) {
      const ch = code[k];
      if (ch === '(') dep++;
      else if (ch === ')' && --dep === 0) return k;
    }
    return code.length;
  };
  const skipWs = (k) => {
    while (k < code.length && /\s/.test(code[k])) k++;
    return k;
  };
  const calls = [];
  for (const m of code.matchAll(TEST_NAME)) {
    let b = m.index - 1;
    while (b >= 0 && /\s/.test(code[b])) b--;
    if (b >= 0 && /[.\w$]/.test(code[b])) continue;
    const mods = [];
    let k = skipWs(m.index + m[0].length);
    let open = -1;
    let close = -1;
    for (;;) {
      if (code[k] === '.') {
        const mm = /^\s*([A-Za-z_$][\w$]*)/.exec(code.slice(k + 1, k + 80));
        if (!mm) break;
        mods.push(mm[1]);
        k = skipWs(k + 1 + mm[0].length);
      } else if (code[k] === '(') {
        open = k;
        close = closeOf(k);
        k = skipWs(close + 1);
        if (code[k] !== '(') break;
      } else break;
    }
    if (open < 0) continue;
    const s = strAt.get(skipWs(open + 1));
    const name = m[1];
    calls.push({
      index: m.index,
      name,
      mods,
      title: s ? s.value : null,
      titleRange: s ? [s.start, s.end] : null,
      scope: [open, close],
      skip: /^x/.test(name) || mods.some((x) => SKIP_MOD.has(x)),
      only: /^f/.test(name) || mods.includes('only'),
    });
  }
  const within = (x, c) => x.index > c.scope[0] && x.index < c.scope[1];
  const onlys = calls.filter((c) => c.only);
  for (const c of calls) {
    if (calls.some((o) => o.skip && within(c, o))) c.skip = c.inheritedSkip = true;
    if (onlys.length && !c.only && !onlys.some((o) => within(c, o) || within(o, c))) c.skip = c.notOnly = true;
  }
  return { calls, strings };
}

export function scanTests(repo) {
  const re = new RegExp(repo.config.testPattern);
  const files = new Set();
  for (const d of repo.config.testDirs || []) for (const f of walk(path.join(repo.dir, d))) if (re.test(toPosix(f))) files.add(f);
  const hits = [];
  for (const f of [...files].sort()) {
    const text = fs.readFileSync(f, 'utf8');
    const rel = toPosix(path.relative(repo.dir, f));
    const starts = [0];
    for (let k = 0; k < text.length; k++) if (text[k] === '\n') starts.push(k + 1);
    const lineAt = (idx) => {
      let lo = 0;
      let hi = starts.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (starts[mid] <= idx) lo = mid;
        else hi = mid - 1;
      }
      return lo + 1;
    };
    const { calls } = testCalls(text);
    const inTitles = [];
    for (const c of calls) {
      if (c.title === null) continue;
      inTitles.push(c.titleRange);
      const why = c.notOnly ? 'another test in the file uses .only' : c.inheritedSkip ? 'inside a skipped suite' : c.skip ? 'skipped or todo' : '';
      for (const q of refsIn(c.title).q)
        if (prefixOf(q.code) === 'AC') hits.push({ key: `${q.art}/${q.code}`, file: rel, line: lineAt(c.index), title: c.title, skipped: c.skip, why, linked: !c.skip });
    }
    for (const m of text.matchAll(RE.qref)) {
      if (m[3] !== 'AC' || inTitles.some(([a, b]) => m.index >= a && m.index < b)) continue;
      hits.push({ key: `${m[1]}-${Number(m[2])}/${normCode(m[3], m[4])}`, file: rel, line: lineAt(m.index), title: null, skipped: false, linked: false, loose: true });
    }
  }
  return hits;
}

const xmlText = (s) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

export function loadResults(repo, files) {
  const cases = [];
  for (const f of files) {
    const abs = path.resolve(repo.dir, f);
    if (!fs.existsSync(abs)) throw new CliError(`results file ${f} does not exist`);
    const text = fs.readFileSync(abs, 'utf8').trim();
    if (text.startsWith('<')) {
      for (const m of text.matchAll(/<testcase\b([^>]*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g)) {
        const attr = (n) => xmlText((m[1].match(new RegExp(`\\b${n}="([^"]*)"`)) || [])[1] || '');
        const body = m[2] || '';
        const status = /<(failure|error)\b/.test(body) ? 'failed' : /<skipped\b/.test(body) ? 'skipped' : 'passed';
        cases.push({ title: `${attr('classname')} ${attr('name')}`, status });
      }
    } else {
      let j;
      try {
        j = JSON.parse(text);
      } catch {
        throw new CliError(`results file ${f} is neither JUnit XML nor JSON`);
      }
      if (Array.isArray(j.testResults))
        for (const r of j.testResults)
          for (const t of r.assertionResults || []) cases.push({ title: t.fullName || [...(t.ancestorTitles || []), t.title].join(' '), status: t.status === 'passed' ? 'passed' : t.status === 'failed' ? 'failed' : 'skipped' });
      else if (Array.isArray(j.passes) || Array.isArray(j.failures)) {
        for (const t of j.passes || []) cases.push({ title: t.fullTitle || t.title, status: 'passed' });
        for (const t of j.failures || []) cases.push({ title: t.fullTitle || t.title, status: 'failed' });
        for (const t of j.pending || []) cases.push({ title: t.fullTitle || t.title, status: 'skipped' });
      } else throw new CliError(`results file ${f}: unknown JSON shape (use JUnit XML, or Jest/Vitest/Mocha JSON)`);
    }
  }
  const byAc = new Map();
  for (const c of cases)
    for (const q of refsIn(c.title).q) {
      if (prefixOf(q.code) !== 'AC') continue;
      const k = `${q.art}/${q.code}`;
      const e = byAc.get(k) || { passed: 0, failed: 0, skipped: 0 };
      e[c.status]++;
      byAc.set(k, e);
    }
  return { cases: cases.length, byAc };
}

// ─── Tree ───────────────────────────────────────────────────────────────────────────────────────
// byId holds the artifact in force for each id. A revision (file *.rev.md, frontmatter revises:)
// is a draft of the next version of an approved artifact; it lives beside it until approved.

export function loadTree(repo) {
  const root = path.join(repo.dir, repo.config.root);
  const arts = [];
  const reviewDir = path.join(root, 'review');
  for (const f of walk(root).sort()) {
    if (!RE.artifactFile.test(path.basename(f)) || inside(f, reviewDir)) continue;
    arts.push(parseArtifact(f, toPosix(path.relative(repo.dir, f)), fs.readFileSync(f, 'utf8')));
  }
  const byId = new Map();
  const dupIds = new Set();
  const revisions = new Map();
  const dupRevs = new Set();
  for (const a of arts) {
    a.pins = [];
    for (const p of parseList(a.fm?.parent)) {
      const m = RE.pin.exec(p);
      a.pins.push(m ? { raw: p, id: m[1].replace(/-0*(\d+)$/, '-$1'), version: m[2] } : { raw: p, bad: true });
    }
    a.isRevision = Boolean(a.fm && !isBlank(a.fm.revises));
    if (!a.id) continue;
    if (a.isRevision) {
      if (revisions.has(a.id)) dupRevs.add(a.id);
      else revisions.set(a.id, a);
    } else if (byId.has(a.id)) dupIds.add(a.id);
    else byId.set(a.id, a);
  }
  const tree = { repo, root, arts, byId, dupIds, revisions, dupRevs };
  tree.inForce = (a) => Boolean(a.id) && !a.isRevision && byId.get(a.id) === a;
  tree.children = (id) => arts.filter((x) => tree.inForce(x) && !FINAL.has(x.status) && x.pins.some((p) => p.id === id));
  tree.target = (id) => revisions.get(id) || byId.get(id);
  // What an artifact sees for an id: itself, the pending revision it pins by version (a revision set),
  // or the version in force.
  // A pin to X@v where v is X's pending revision reaches through the chain: a PLAN pinning the DSN
  // revision also sees the SPEC revision that DSN revision pins. A direct pin wins over an inherited one.
  const views = new Map();
  const view = (a) => {
    if (views.has(a)) return views.get(a);
    const v = new Map();
    views.set(a, v);
    const direct = [];
    for (const p of a.pins || []) {
      if (p.bad) continue;
      const rev = revisions.get(p.id);
      const pa = rev && rev !== a && rev.version === p.version ? rev : byId.get(p.id);
      if (pa && pa !== a) v.set(p.id, pa), direct.push(pa);
    }
    for (const pa of direct) for (const [k, x] of view(pa)) if (!v.has(k) && k !== a.id) v.set(k, x);
    return v;
  };
  tree.sees = (a, id) => {
    if (a && id === a.id) return a;
    const x = a ? view(a).get(id) : null;
    return x && x.isRevision ? x : byId.get(id);
  };
  return tree;
}

export function ancestors(tree, a, seen = new Set()) {
  for (const p of a.pins || []) {
    if (p.bad || seen.has(p.id)) continue;
    seen.add(p.id);
    const pa = tree.sees ? tree.sees(a, p.id) : tree.byId.get(p.id);
    if (pa) ancestors(tree, pa, seen);
  }
  return seen;
}

function descendants(tree, a, type) {
  const out = new Map();
  const stack = [a];
  while (stack.length) {
    const x = stack.pop();
    for (const c of tree.children(x.id)) {
      if (out.has(c.id)) continue;
      out.set(c.id, c);
      stack.push(c);
    }
  }
  return [...out.values()].filter((x) => !type || x.type === type);
}

// ─── Hash and file edits ────────────────────────────────────────────────────────────────────────

export function computeHash(text, type, extra = []) {
  const skip = new RegExp(`^(${['status', 'approved_by', 'approved_at', 'approved_hash', ...extra].join('|')})\\s*:`);
  const lines = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let inFm = false;
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i].replace(/\s+$/, '');
    if (i === 0 && l === '---') {
      inFm = true;
      out.push(l);
      continue;
    }
    if (inFm) {
      if (l === '---') inFm = false;
      else if (skip.test(l)) continue;
      out.push(l);
      continue;
    }
    out.push(l);
  }
  while (out.length && out[out.length - 1] === '') out.pop();
  return `sha256:${crypto.createHash('sha256').update(out.join('\n')).digest('hex').slice(0, 24)}`;
}

/** Hash a review report is bound to: the content, without lifecycle fields and without the review: pointer itself. */
export const reviewHash = (text, type) => computeHash(text, type, ['review']);

/** The review report an artifact points to, checked against the artifact: { problems: [{sev, code, msg}] }. */
export function reviewStatus(tree, a) {
  const problems = [];
  if (isBlank(a.fm.review)) return problems;
  const abs = path.join(tree.repo.dir, a.fm.review);
  if (!fs.existsSync(abs)) return [{ sev: 'error', code: 'R09', msg: `review report ${a.fm.review} does not exist` }];
  const { fm } = parseFrontmatter(fs.readFileSync(abs, 'utf8'));
  const stamp = `skyline review-stamp ${a.id}`;
  if (!fm || isBlank(fm.review_of) || isBlank(fm.version) || isBlank(fm.reviewed_hash))
    return [{ sev: 'error', code: 'R10', msg: `review report ${a.fm.review} has no review header (review_of, version, reviewed_hash); after the review run: ${stamp}` }];
  if (normId(fm.review_of) !== a.id || fm.version !== a.version)
    return [{ sev: 'error', code: 'R10', msg: `review report ${a.fm.review} reviews ${fm.review_of} ${fm.version}, not ${a.id} ${a.version}; a review belongs to one artifact version. Review this one, or clear review:` }];
  if (fm.reviewed_hash !== reviewHash(a.text, a.type) && a.status !== 'approved')
    problems.push({ sev: 'open', code: 'Q05', msg: `${a.id} changed after its review was stamped (reviewed_hash differs). Have the changed items reviewed, then: ${stamp} --note "<what changed and who checked it>"` });
  return problems;
}

export function setFrontmatter(text, updates) {
  const nl = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  let end = lines.indexOf('---', 1);
  if (lines[0] !== '---' || end < 0) throw new CliError('file has no frontmatter');
  for (const [k, v] of Object.entries(updates)) {
    const line = v === '' ? `${k}:` : `${k}: ${v}`;
    const idx = lines.findIndex((l, i) => i > 0 && i < end && new RegExp(`^${k}\\s*:`).test(l));
    if (v === null) {
      if (idx > 0) {
        lines.splice(idx, 1);
        end--;
      }
      continue;
    }
    if (idx > 0) lines[idx] = line;
    else {
      lines.splice(end, 0, line);
      end++;
    }
  }
  return lines.join(nl);
}

export function appendChangelog(text, cells) {
  const nl = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  const row = `| ${cells.map((c) => String(c).replace(/\|/g, '\\|')).join(' | ')} |`;
  const h = lines.findIndex((l) => /^##\s+(\d+\.\s*)?change log\s*$/i.test(l));
  const head = ['| Version | Date | By | Change |', '| --- | --- | --- | --- |'];
  if (h < 0) {
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
    lines.push('', '## Change log', '', ...head, row, '');
    return lines.join(nl);
  }
  let last = -1;
  for (let i = h + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) break;
    if (lines[i].trim().startsWith('|')) last = i;
  }
  if (last < 0) lines.splice(h + 1, 0, '', ...head, row);
  else lines.splice(last + 1, 0, row);
  return lines.join(nl);
}

/** True when an Edit/MultiEdit only flips task checkboxes. */
export function onlyCheckboxChange(pairs) {
  if (!pairs.length) return false;
  const norm = (s) => String(s || '').replace(/\[[xX ]\]/g, '[ ]');
  return pairs.every(([o, n]) => o !== n && norm(o) === norm(n));
}

// ─── Check ──────────────────────────────────────────────────────────────────────────────────────

const SEV_ORDER = { error: 0, open: 1, warn: 2 };
const lineCount = (arr) => (arr ? arr.length : 0);

export function checkTree(tree, opts = {}) {
  const issues = [];
  const add = (sev, code, a, line, msg) =>
    issues.push({ sev, code, file: typeof a === 'string' ? a : a?.rel || '', line: line || 1, id: typeof a === 'string' ? '' : a?.id || '', msg });
  const { byId } = tree;
  const strict = (a) => a.status === 'approved' || a.abs === opts.approving;
  const active = tree.arts.filter((a) => tree.inForce(a) && !FINAL.has(a.status));
  const lookup = (a, art) => tree.sees(a, art);
  const git = gitHelper(tree.repo.dir);
  const stats = { guardGroups: 0, guardExclusive: 0, guardOverlap: 0, guardUnverified: 0, guardInfeasible: 0, guardFreeText: 0, tests: null };

  // Frontmatter, ids, lifecycle fields
  for (const a of tree.arts) {
    if (!a.fm) {
      add('error', 'F01', a, 1, 'missing frontmatter (a --- block with id, title, version, status)');
      continue;
    }
    if (!a.type) {
      add('error', 'F01', a, a.fmLines.id, `invalid id "${a.fm.id || ''}" (expected ${TYPE_NAMES.map((t) => `${t}-n`).join(', ')})`);
      continue;
    }
    const base = path.basename(a.abs);
    if (!(base === `${a.id}.md` || base.startsWith(`${a.id}-`) || base.startsWith(`${a.id}.`))) add('error', 'F02', a, a.fmLines.id, `file name must be "${a.id}-<slug>.md"`);
    if (path.basename(path.dirname(a.abs)) !== TYPES[a.type].dir) add('warn', 'F02', a, a.fmLines.id, `${a.type} files belong in ${tree.repo.config.root}/${TYPES[a.type].dir}/`);
    if (!a.isRevision && tree.dupIds.has(a.id)) add('error', 'F03', a, a.fmLines.id, `duplicate id ${a.id}. If this is the newer draft, run: skyline renumber ${a.rel}`);
    if (a.isRevision && tree.dupRevs.has(a.id)) add('error', 'F03', a, a.fmLines.id, `more than one revision of ${a.id}; keep one (skyline discard removes a revision)`);
    if (isBlank(a.fm.title)) add('error', 'F01', a, a.fmLines.title || 1, 'title is required');
    if (!STATUSES.includes(a.status)) add('error', 'F04', a, a.fmLines.status || 1, `status must be one of ${STATUSES.join(', ')}`);
    if (!TYPES[a.type].gated && a.status === 'approved') add('error', 'F04', a, a.fmLines.status, `${a.type} is a working document and is never approved; set status: draft`);
    if (!RE.semver.test(a.version || '')) add('error', 'F05', a, a.fmLines.version || 1, 'version must be MAJOR.MINOR.PATCH');
    const ap = ['approved_by', 'approved_at', 'approved_hash'];
    if (a.status === 'approved') {
      for (const k of ap) if (isBlank(a.fm[k])) add('error', 'F06', a, a.fmLines[k] || a.fmLines.status, `approved artifact is missing ${k}; only \`skyline approve\` sets it`);
      if (!isBlank(a.fm.approved_at) && !RE.date.test(a.fm.approved_at)) add('error', 'F06', a, a.fmLines.approved_at, 'approved_at must be YYYY-MM-DD');
    }
    if (a.status === 'draft') for (const k of ap) if (!isBlank(a.fm[k])) add('error', 'F06', a, a.fmLines[k], `a draft must not carry ${k}; only \`skyline approve\` sets it`);
    if (LOCKED.has(a.status) && !isBlank(a.fm.approved_hash) && computeHash(a.text, a.type) !== a.fm.approved_hash)
      add('error', 'F06', a, a.fmLines.approved_hash, `content changed after approval (hash mismatch). Restore the approved text from git; to change it, create a revision: skyline revise ${a.id} --level <patch|minor|major> --reason "<why>"`);
    if (a.isRevision) {
      const b = byId.get(a.id);
      const ln = a.fmLines.revises;
      if (!b) add('error', 'F11', a, ln, `revision of ${a.id}, which does not exist`);
      else if (b.status !== 'approved') add('error', 'F11', a, ln, `${a.id} is ${b.status}; edit it directly instead of revising it`);
      else if (a.fm.revises !== b.version) add('error', 'F11', a, ln, `revises ${a.fm.revises}, but ${a.id} is now ${b.version}; discard this revision and revise again`);
      else if (RE.semver.test(a.version || '') && cmpVer(a.version, b.version) <= 0) add('error', 'F11', a, a.fmLines.version, `a revision's version must be above ${b.version}`);
      if (a.status !== 'draft') add('error', 'F11', a, a.fmLines.status, 'a revision stays draft until the owner approves it');
    }
  }

  for (const a of tree.arts) {
    if (!a.type) continue;
    if (a.isRevision ? tree.revisions.get(a.id) !== a : byId.get(a.id) !== a) continue;
    const final = FINAL.has(a.status);
    const spec = TYPES[a.type];

    // Parents
    if (spec.required && a.pins.length === 0) add('error', 'F07', a, a.fmLines.parent || a.fmLines.id, `${a.type} needs parent: [${spec.parents.join('|')}-n@x.y.z]`);
    if (!spec.parents.length && a.pins.length) add('error', 'F07', a, a.fmLines.parent, `${a.type} has no parent artifacts; cite SRC lines in Source cells instead`);
    for (const p of a.pins) {
      const ln = a.fmLines.parent;
      if (p.bad) {
        add('error', 'F07', a, ln, `bad parent pin "${p.raw}" (expected ${spec.parents.join('|') || 'ID'}-n@x.y.z)`);
        continue;
      }
      const pa = tree.sees(a, p.id);
      if (!pa) {
        add('error', 'F07', a, ln, `parent ${p.id} does not exist`);
        continue;
      }
      if (!spec.parents.includes(pa.type)) add('error', 'F07', a, ln, `parent of a ${a.type} must be ${spec.parents.join(' or ') || 'none'}, not ${pa.type}`);
      if (pa.isRevision) {
        if (!final)
          add('open', 'F14', a, ln, `pins ${p.raw}, the pending revision of ${p.id} (checked against it as one revision set). ${spec.gated ? `The owner approves ${p.id} first; \`skyline approve ${p.id} ${a.id}\` does both in order` : `This clears when the owner approves ${p.id}`}`);
        continue;
      }
      if (final || !RE.semver.test(pa.version || '')) continue;
      if (FINAL.has(pa.status)) add('error', 'F07', a, ln, `parent ${p.id} is ${pa.status}; re-parent to its replacement`);
      else if (cmpVer(p.version, pa.version) > 0) add('error', 'F07', a, ln, `pin ${p.raw} is ahead of ${p.id} (now ${pa.version})`);
      else if (majorMinor(p.version) !== majorMinor(pa.version))
        add(opts.strict ? 'error' : 'warn', 'F08', a, ln, `drift: ${p.id} is now ${pa.version}; this pins ${p.version}. Review the change, then ${a.status === 'approved' ? `skyline revise ${a.id} --level patch --reason "repin" and ` : ''}skyline repin ${a.id}`);
      else if (pa.status === 'draft' && a.status === 'approved') add('warn', 'F08', a, ln, `parent ${p.id} is draft`);
    }

    // Flow
    if (a.type === 'SPEC' && !final) {
      const flow = a.fm.flow;
      if (!FLOWS.includes(flow)) add('error', 'F10', a, a.fmLines.flow || a.fmLines.id, `flow must be one of ${FLOWS.join(', ')}`);
      if (flow === 'project' && !a.pins.some((p) => byId.get(p.id)?.type === 'BRIEF')) add('error', 'F10', a, a.fmLines.flow, 'a project-flow SPEC needs a BRIEF parent');
      if (flow === 'adopt') {
        if (isBlank(a.fm.code_ref)) add('error', 'F10', a, a.fmLines.flow, 'an adopt-flow SPEC needs code_ref: <git commit> for its code cites');
        else if (git.ok && !git.commit(a.fm.code_ref)) add('error', 'F10', a, a.fmLines.code_ref, `code_ref ${a.fm.code_ref} is not a commit in this repository`);
      }
    }

    // Risk and review
    if (['SPEC', 'DSN'].includes(a.type) && !final) {
      const risk = isBlank(a.fm.risk) ? 'normal' : a.fm.risk;
      if (!['normal', 'high'].includes(risk)) add('error', 'F01', a, a.fmLines.risk, 'risk must be normal or high');
      for (const p of reviewStatus(tree, a)) add(p.sev, p.code, a, a.fmLines.review, p.msg);
      if (a.isRevision && byId.get(a.id) && RE.semver.test(a.version || '') && levelOf(byId.get(a.id).version, a.version) === 'major' && risk !== 'high')
        add('error', 'Q06', a, a.fmLines.risk || a.fmLines.version, `a major revision (${byId.get(a.id).version} → ${a.version}) changes meaning or removes items: it must be risk: high, so it gets a review`);
      if (risk === 'high' && isBlank(a.fm.review) && a.status !== 'approved')
        add('open', 'Q04', a, a.fmLines.risk, `risk: high needs a review report: skyline:review writes ${tree.repo.config.root}/review/${a.id}-${a.version}.md, then \`skyline review-stamp ${a.id}\` binds it to this content. Or the owner approves with --skip-review "<reason>"`);
    }

    // Supersedes
    if (!isBlank(a.fm.supersedes)) {
      const s = byId.get(a.fm.supersedes);
      if (!s) add('error', 'F09', a, a.fmLines.supersedes, `supersedes ${a.fm.supersedes}, which does not exist`);
      else if (s.type !== a.type || s === a) add('error', 'F09', a, a.fmLines.supersedes, 'supersedes must name another artifact of the same type');
    }
    if (final || a.type === 'SRC') continue;
    for (const d of a.dupDefs) add('error', 'D01', a, d.line, `${d.code} is defined twice in ${a.id}`);
    for (const d of a.defList) if (!spec.codes.includes(prefixOf(d.code))) add('error', 'D02', a, d.line, `${prefixOf(d.code)} codes are not used in ${a.type}`);
    for (const d of a.defList.filter((x) => x.kind === 'heading' && prefixOf(x.code) !== 'F')) {
      const p = prefixOf(d.code);
      add('error', 'D03', a, d.line, `${d.code} is written as a heading; only flows (F-nn) may be. Put it in the ${p} table${SCHEMA[p] ? ` (columns: Code, ${SCHEMA[p].join(', ')})` : ''} so its source and links can be checked`);
    }

    const anc = ancestors(tree, a);
    const inChain = (art) => art === a.id || anc.has(art);
    const adopt = a.type === 'SPEC' && a.fm.flow === 'adopt';

    // References
    for (const m of a.mentions) {
      const r = refsIn(m.text);
      for (const q of r.q) {
        const t = lookup(a, q.art);
        if (!t) add('error', 'R01', a, m.line, `${q.raw}: ${q.art} does not exist`);
        else if (!t.defs.has(q.code)) add('error', 'R01', a, m.line, `${q.raw}: ${q.code} is not defined in ${q.art}${tree.revisions.get(q.art)?.defs.has(q.code) && t !== tree.revisions.get(q.art) ? ` (only in its pending revision ${tree.revisions.get(q.art).version}; pin it to check against it: skyline repin ${a.id} --pending)` : ''}`);
        else if (t !== a && FINAL.has(t.status)) add('error', 'R05', a, m.line, `${q.raw}: ${q.art} is ${t.status}; point to its replacement`);
        else if (t !== a && TYPES[t.type].gated && t.status !== 'approved' && strict(a)) add('error', 'R05', a, m.line, `${q.raw}: ${q.art}${t.isRevision ? ` ${t.version} (pending revision)` : ''} is not approved`);
      }
      for (const c of r.c) {
        const s = byId.get(c.art);
        if (!s) add('error', 'R04', a, m.line, `${c.raw}: ${c.art} does not exist`);
        else if (c.from > c.to || c.from <= s.bodyStart || c.to > s.lines.length)
          add('error', 'R04', a, m.line, `${c.raw}: lines out of range (${c.art} body is L${s.bodyStart + 1}-L${s.lines.length})`);
        else if (FINAL.has(s.status)) add('error', 'R05', a, m.line, `${c.raw}: ${c.art} is ${s.status}; cite its replacement`);
        else if (s.status !== 'approved' && strict(a)) add('error', 'R05', a, m.line, `${c.raw}: ${c.art} is not approved (approve it with --with-sources)`);
      }
      for (const k of r.k) {
        if (!adopt) add('error', 'R08', a, m.line, `${k.raw}: code cites are allowed only in adopt-flow SPECs; cite a source (SRC) instead`);
        else if (!git.ok) add('warn', 'R08', a, m.line, `${k.raw}: git is not available; code cite not verified`);
        else if (!isBlank(a.fm.code_ref) && git.commit(a.fm.code_ref)) {
          const lines = git.file(a.fm.code_ref, k.file);
          if (!lines) add('error', 'R08', a, m.line, `${k.raw}: ${k.file} does not exist at ${a.fm.code_ref}`);
          else if (k.from > k.to || k.to > lineCount(lines)) add('error', 'R08', a, m.line, `${k.raw}: lines out of range (${k.file} has ${lineCount(lines)} lines at ${a.fm.code_ref})`);
        }
      }
      for (const l of r.l) {
        if (!spec.codes.includes(prefixOf(l.code)))
          add('error', 'R03', a, m.line, `bare ${l.raw} is not a ${a.type} code; qualify it, e.g. ${codeHome(l.code)}-n/${l.code}`);
        else if (!a.defs.has(l.code)) add('error', 'R02', a, m.line, `${l.raw} is not defined in ${a.id}`);
      }
      for (const x of r.a) if (!byId.has(x.art)) add('error', 'R06', a, m.line, `${x.raw} does not exist`);
    }

    // Column contracts
    for (const t of a.tables) {
      const rows = t.rows.filter((r) => r.def);
      if (!rows.length) continue;
      const pfx = prefixOf(rows[0].def.code);
      const missingCols = (SCHEMA[pfx] || []).filter((c) => col(t, c) < 0);
      if (missingCols.length) add('error', 'C07', a, t.line, `${pfx} rows need the column${missingCols.length > 1 ? 's' : ''} ${missingCols.join(', ')}; without ${missingCols.length > 1 ? 'them' : 'it'} the row cannot be checked`);
      const iSource = col(t, 'source');
      const iCovers = col(t, 'covers');
      for (const r of rows.filter((x) => prefixOf(x.def.code) !== pfx))
        add('error', 'C07', a, r.def.line, `${r.def.code} sits in a ${pfx} table; each item type needs its own table with its own columns${SCHEMA[prefixOf(r.def.code)] ? ` (${prefixOf(r.def.code)}: ${SCHEMA[prefixOf(r.def.code)].join(', ')})` : ''}`);
      for (const r of rows) {
        const d = r.def;
        if (iSource >= 0) {
          const cell = r.cells[iSource] || '';
          const rr = refsIn(cell);
          const good = rr.c.length + (adopt ? rr.k.length : 0) + rr.q.filter((q) => q.art !== a.id && inChain(q.art)).length;
          if (isBlank(cell)) add('error', 'C01', a, d.line, `${d.code} has no Source; cite SRC-n#Lx${adopt ? ', code:path#Lx' : ''} or an item up the parent chain, or write [CLARIFY: ...]`);
          else if (!good && !hasMarker(cell)) add('error', 'C01', a, d.line, `${d.code} Source must cite SRC-n#Lx${adopt ? ', code:path#Lx' : ''} or a qualified item up the parent chain`);
          for (const q of rr.q) if (!inChain(q.art)) add('error', 'R07', a, d.line, `${d.code} Source cites ${q.raw}, which is not up the parent chain`);
          if (prefixOf(d.code) === 'DEC' && !rr.c.length) add('error', 'C06', a, d.line, `${d.code} decision must cite the owner's words (SRC-n#Lx); the AI does not decide`);
        }
        if (iCovers >= 0) {
          const rr = refsIn(r.cells[iCovers] || '');
          if (!rr.q.length && !rr.l.length) add('error', 'C02', a, d.line, `${d.code} Covers is empty`);
          for (const q of rr.q) if (!inChain(q.art)) add('error', 'R07', a, d.line, `${d.code} Covers ${q.raw}, which is not up the parent chain`);
        }
      }
      const need = (name, test, msg) => {
        const i = col(t, name);
        if (i < 0) return;
        for (const r of rows) if (!test(r.cells[i] || '')) add('error', 'C03', a, r.def.line, `${r.def.code}: ${msg}`);
      };
      if (pfx === 'G') need('success measure', (v) => !isBlank(v), 'Success measure is required');
      if (pfx === 'ASM') need('validate by', (v) => !isBlank(v), 'Validate by is required (how and when it gets confirmed)');
      if (pfx === 'N') need('target', (v) => /\d/.test(v) || hasMarker(v), 'Target must be a number with its unit');
      if (pfx === 'DEC') need('chosen', (v) => !isBlank(v), 'Chosen is required; write [CLARIFY: ...] until the owner decides');
      if (pfx === 'S') need('kind', (v) => ['initial', 'normal', 'terminal'].includes(v.toLowerCase()), 'Kind must be initial, normal or terminal');
      if (pfx === 'TK') for (const r of rows) if (r.def.codeIdx !== 1 || !/^\[[ xX]\]$/.test(r.cells[0])) add('error', 'C05', a, r.def.line, `${r.def.code}: first cell must be [ ] or [x]`);
      if (pfx === 'P') {
        const ia = col(t, 'action');
        const actors = t.header.map((h, i) => ({ h, i })).filter(({ i, h }) => i > ia && ia >= 0 && normKey(h) !== 'source');
        if (ia < 0) add('error', 'C04', a, t.line, 'permission matrix needs an Action column');
        for (const { h } of actors) if (!refsIn(h).q.some((q) => prefixOf(q.code) === 'A')) add('error', 'C04', a, t.line, `permission column "${h}" must name a qualified actor, e.g. BRIEF-1/A-01`);
        for (const r of rows)
          for (const { i, h } of actors) {
            const v = (r.cells[i] || '').trim();
            const ok = /^(Y|N)$/i.test(v) || refsIn(v).l.some((l) => prefixOf(l.code) === 'R');
            if (!ok) add('error', 'C04', a, r.def.line, `${r.def.code} × "${trunc(h, 30)}": cell must be Y, N or a rule code (R-nn)`);
          }
      }
    }

    // Minimum content
    for (const [p, n] of Object.entries(spec.min)) {
      const count = a.defList.filter((d) => prefixOf(d.code) === p).length;
      if (count < n) add('error', 'S01', a, a.bodyStart + 1, `${a.type} needs at least ${n} ${p} item${n > 1 ? 's' : ''}`);
    }

    // Unknowns and vague words
    for (const mk of a.markers) add('open', 'Q01', a, mk.line, `open question ${trunc(mk.text, 90)}`);
    for (const f of a.forbidden) add('error', 'Q02', a, f.line, `"${f.text}" is not allowed; write [CLARIFY: <question>] instead`);
    const vague = (tree.repo.config.vagueWords || []).filter(Boolean);
    if (vague.length) {
      const esc = vague.map((w) => w.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')).sort((x, y) => y.length - x.length);
      const vre = new RegExp(`(?<![\\p{L}\\p{N}])(${esc.join('|')})(?![\\p{L}\\p{N}])`, 'giu');
      for (const d of a.defList) {
        if (['T', 'DF', 'ASM', 'RISK', 'CMP', 'DM', 'IC'].includes(prefixOf(d.code))) continue;
        const words = uniq([...stripInlineCode(defText(d)).matchAll(vre)].map((x) => x[1].toLowerCase()));
        if (words.length) add('warn', 'Q03', a, d.line, `${d.code}: vague wording (${words.join(', ')}); state the exact condition or number`);
      }
    }

    if (a.type === 'SPEC') specLogic(a, add, stats);
  }

  // Glossary across SPECs in force
  const terms = new Map();
  for (const a of active.filter((x) => x.type === 'SPEC')) {
    for (const d of a.defList.filter((x) => prefixOf(x.code) === 'T' && x.kind === 'row')) {
      const term = cellOf(d, 'term').toLowerCase().trim();
      const def = cellOf(d, 'definition').toLowerCase().replace(/\s+/g, ' ').trim();
      if (!term) continue;
      const list = terms.get(term) || [];
      const same = list.find((x) => x.a === a);
      if (same) add('error', 'G01', a, d.line, `term "${term}" is defined twice (${same.d.code}, ${d.code})`);
      else {
        const other = list.find((x) => x.def !== def);
        if (other) add('warn', 'G02', a, d.line, `term "${term}" is defined differently in ${other.a.id}/${other.d.code}`);
      }
      list.push({ a, d, def });
      terms.set(term, list);
    }
  }

  // Coverage across artifacts: first as things are in force, then as they will be once every pending
  // revision is approved (a revision set), so a change is checked end to end before the owner approves it.
  coverage(tree, add);
  if (tree.revisions.size) {
    const seenKeys = new Set(issues.map((i) => `${i.code}|${i.file}|${i.msg}`));
    coverage(projectTree(tree), (sev, code, a, line, msg) => {
      const file = typeof a === 'string' ? a : a?.rel || '';
      const m = `${msg} (once the pending revisions are approved)`;
      if (seenKeys.has(`${code}|${file}|${msg}`) || seenKeys.has(`${code}|${file}|${m}`)) return;
      seenKeys.add(`${code}|${file}|${m}`);
      add(sev, code, a, line, m);
    });
  }

  for (const t of active.filter((x) => x.type === 'PLAN')) {
    const deps = new Map();
    for (const d of t.defList.filter((x) => prefixOf(x.code) === 'TK'))
      deps.set(d.code, refsIn(cellOf(d, 'depends')).l.map((l) => l.code).filter((c) => prefixOf(c) === 'TK'));
    const state = new Map();
    const visit = (c, trail) => {
      if (state.get(c) === 2) return;
      if (state.get(c) === 1) {
        add('error', 'T09', t, t.defs.get(c)?.line, `task dependency cycle: ${[...trail.slice(trail.indexOf(c)), c].join(' → ')}`);
        return;
      }
      state.set(c, 1);
      for (const n of deps.get(c) || []) if (deps.has(n)) visit(n, [...trail, c]);
      state.set(c, 2);
    };
    for (const c of deps.keys()) visit(c, []);
  }

  // Tests: linked (named in a test title) and, with results, passed
  if (opts.tests || opts.results) {
    const hits = scanTests(tree.repo);
    const results = opts.results ? loadResults(tree.repo, opts.results) : null;
    for (const h of hits.filter((x) => x.title !== null)) {
      const [art, code] = h.key.split('/');
      const s = byId.get(art);
      if (!s || !s.defs.has(code)) add('error', 'T07', h.file, h.line, `test title cites ${h.key}, which is not defined`);
    }
    const st = { expected: 0, linked: 0, passed: 0, ran: 0, results: results ? opts.results.join(', ') : null };
    for (const s of active.filter((x) => x.type === 'SPEC')) {
      if (!descendants(tree, s, 'PLAN').length) continue;
      for (const d of s.defList.filter((x) => prefixOf(x.code) === 'AC')) {
        const key = `${s.id}/${d.code}`;
        const mine = hits.filter((h) => h.key === key);
        const r = results ? results.byAc.get(key) : null;
        const ran = Boolean(r && r.passed + r.failed > 0);
        st.expected++;
        if (mine.some((h) => h.linked)) st.linked++;
        else if (!ran) {
          const sk = mine.find((h) => h.skipped);
          const lo = mine.find((h) => h.loose);
          const why = sk ? `only skipped tests name it (${sk.file}:${sk.line}, ${sk.why})` : lo ? `it appears only in comments or plain strings (${lo.file}:${lo.line}), not in a test title` : 'no test title names it';
          add('error', 'T06', s, d.line, `${key} has no linked test: ${why}${results ? `, and ${st.results} has no run of it` : ''}`);
          continue;
        }
        if (!results) continue;
        if (ran) st.ran++;
        if (!ran) add('error', 'T11', s, d.line, `${key}: its test did not run (not in ${st.results}${r ? '; only skipped' : ''})`);
        else if (r.failed) add('error', 'T11', s, d.line, `${key}: ${r.failed} failing test(s) in ${st.results}`);
        else st.passed++;
      }
    }
    stats.tests = st;
  }

  // Plans built on unapproved behaviour; pending revisions (errors under --strict)
  for (const p of active.filter((x) => x.type === 'PLAN')) {
    const unapproved = [...ancestors(tree, p)].map((id) => byId.get(id)).filter((x) => x && TYPES[x.type].gated && x.status !== 'approved');
    if (unapproved.length) add(opts.strict ? 'error' : 'warn', 'T12', p, p.fmLines.parent, `${p.id} builds on ${unapproved.map((x) => `${x.id} (${x.status})`).join(', ')}; code must follow approved behaviour only`);
  }
  if (opts.strict)
    for (const r of tree.revisions.values()) add('error', 'F13', r, r.fmLines.revises, `pending revision of ${r.id} is not approved; merging now would ship a behaviour change nobody approved`);

  // Ids used differently on other branches
  if (opts.branches) {
    const other = branchArtifacts(tree.repo, git);
    for (const a of tree.arts.filter((x) => x.id && !x.isRevision)) {
      const mine = path.basename(a.abs);
      const clash = uniq(other.files.filter((f) => f.id === a.id && f.base !== mine).map((f) => `${f.ref}:${f.base}`));
      if (!clash.length) continue;
      if (a.status === 'draft') add('error', 'F12', a, a.fmLines.id, `${a.id} is also used on ${clash.join(', ')}; renumber this draft before merging: skyline renumber ${a.id}`);
      else add('warn', 'F12', a, a.fmLines.id, `${a.id} is also used on ${clash.join(', ')}; that branch must renumber its draft`);
    }
    if (!git.ok) add('warn', 'F12', '', 1, '--branches needs git; skipped');
  }

  // Vendored checker version
  const vend = path.join(tree.repo.dir, '.skyline', 'skyline.mjs');
  if (fs.existsSync(vend) && fileURLToPath(import.meta.url) !== vend) {
    const m = fs.readFileSync(vend, 'utf8').match(/export const VERSION = '([^']+)'/);
    if (m && m[1] !== VERSION) add('warn', 'V01', '.skyline/skyline.mjs', 1, `vendored checker is ${m[1]}, plugin is ${VERSION}; the owner can run \`node "${fileURLToPath(import.meta.url)}" upgrade\` from the repo root`);
  }

  issues.sort((x, y) => x.file.localeCompare(y.file) || x.line - y.line || SEV_ORDER[x.sev] - SEV_ORDER[y.sev] || x.code.localeCompare(y.code));
  Object.defineProperty(issues, 'stats', { value: stats, enumerable: false });
  return issues;
}

/** The tree as it will be when every pending revision is approved. */
export function projectTree(tree) {
  const byId = new Map(tree.byId);
  for (const [id, r] of tree.revisions) byId.set(id, r);
  const p = { ...tree, byId, projected: true };
  p.inForce = (a) => Boolean(a.id) && byId.get(a.id) === a;
  p.children = (id) => tree.arts.filter((x) => p.inForce(x) && !FINAL.has(x.status) && x.pins.some((q) => q.id === id));
  p.sees = (a, id) => (a && id === a.id ? a : byId.get(id));
  p.target = (id) => byId.get(id);
  return p;
}

function coverage(tree, add) {
  const { byId } = tree;
  const active = tree.arts.filter((a) => tree.inForce(a) && !FINAL.has(a.status));
  const blame = (list) => {
    const drafts = list.filter((x) => x.status === 'draft');
    return drafts.length ? drafts : list.slice(-1);
  };
  const refsFrom = (arts, pfxs, target) => {
    const set = new Set();
    for (const x of arts)
      for (const d of x.defList)
        if (pfxs.includes(prefixOf(d.code))) for (const q of refsIn(defText(d)).q) if (q.art === target) set.add(q.code);
    return set;
  };
  for (const s of active.filter((x) => x.type === 'SPEC')) {
    const dsns = tree.children(s.id).filter((x) => x.type === 'DSN');
    const plans = descendants(tree, s, 'PLAN');
    const holders = [...dsns, ...plans];
    if (holders.length) {
      const realized = refsFrom(holders, ['RZ'], s.id);
      const mapped = refsFrom(holders, ['DM'], s.id);
      const names = holders.map((x) => x.id).join(', ');
      for (const d of s.defList) {
        const p = prefixOf(d.code);
        if (p === 'R' && !realized.has(d.code)) for (const x of blame(holders)) add('error', 'T03', x, tableLine(x, 'RZ'), `${s.id}/${d.code} is not realized in ${names} (add an RZ row)`);
        if (p === 'DF' && !mapped.has(d.code)) for (const x of blame(holders)) add('error', 'T04', x, tableLine(x, 'DM'), `${s.id}/${d.code} is not mapped in ${names} (add a DM row)`);
      }
    }
    if (plans.length) {
      const covered = refsFrom(plans, ['TK'], s.id);
      for (const d of s.defList.filter((x) => prefixOf(x.code) === 'AC'))
        if (!covered.has(d.code)) for (const x of blame(plans)) add('error', 'T05', x, tableLine(x, 'TK'), `${s.id}/${d.code} is not covered by any task (${plans.map((t) => t.id).join(', ')})`);
    }
    if (s.fm.flow === 'project')
      for (const p of tree.children(s.id).filter((x) => x.type === 'PLAN')) add('error', 'T10', p, p.fmLines.parent, `${s.id} follows the project flow: this PLAN must pin its DSN, not the SPEC`);
    const nRules = s.defList.filter((x) => prefixOf(x.code) === 'R').length;
    if (s.fm.flow === 'feature' && nRules > 20) add('warn', 'E02', s, s.fmLines.flow, `${nRules} rules in one feature SPEC: consider splitting it, or the project flow`);
  }
  for (const p of active.filter((x) => x.type === 'PLAN')) {
    const hasDsn = [...ancestors(tree, p)].some((id) => byId.get(id)?.type === 'DSN');
    const decs = p.defList.filter((d) => prefixOf(d.code) === 'DEC').length;
    if (!hasDsn && decs >= 3) add('warn', 'E01', p, tableLine(p, 'DEC'), `${decs} design decisions without a DSN: consider a DSN approved by the owner (project flow)`);
  }
  for (const b of active.filter((x) => x.type === 'BRIEF')) {
    const specs = tree.children(b.id).filter((x) => x.type === 'SPEC');
    if (!specs.length) continue;
    const used = new Set();
    for (const s of specs) for (const m of s.mentions) for (const q of refsIn(m.text).q) if (q.art === b.id) used.add(q.code);
    for (const d of b.defList.filter((x) => prefixOf(x.code) === 'C'))
      if (!used.has(d.code)) add('warn', 'T08', b, d.line, `${b.id}/${d.code} is not covered by any SPEC (${specs.map((s) => s.id).join(', ')})`);
  }
}

function codeHome(code) {
  const p = prefixOf(code);
  return TYPE_NAMES.find((t) => TYPES[t].codes.includes(p)) || 'ID';
}
function tableLine(a, pfx) {
  const t = a.tables.find((x) => x.rows.some((r) => r.def && prefixOf(r.def.code) === pfx));
  return t ? t.line : a.bodyStart + 1;
}

function specLogic(a, add, stats = { guardGroups: 0, guardExclusive: 0, guardOverlap: 0, guardUnverified: 0, guardInfeasible: 0, guardFreeText: 0 }) {
  const defsOf = (p) => a.defList.filter((d) => prefixOf(d.code) === p);
  // Acceptance coverage
  const covered = new Set();
  for (const d of defsOf('AC')) {
    const r = refsIn(defText(d));
    for (const l of r.l) covered.add(l.code);
    for (const q of r.q) if (q.art === a.id) covered.add(q.code);
  }
  for (const d of defsOf('R')) if (!covered.has(d.code)) add('error', 'T01', a, d.line, `${d.code} has no acceptance criterion (no AC covers it)`);
  for (const p of ['X', 'P', 'F']) for (const d of defsOf(p)) if (!covered.has(d.code)) add('warn', 'T02', a, d.line, `${d.code} has no acceptance criterion`);

  // State machines
  const states = new Map();
  for (const d of defsOf('S').filter((x) => x.kind === 'row'))
    states.set(d.code, { d, machine: cellOf(d, 'machine').trim(), kind: cellOf(d, 'kind').trim().toLowerCase(), out: [], name: cellOf(d, 'state') });
  const trans = [];
  for (const d of defsOf('X').filter((x) => x.kind === 'row')) {
    const pick = (name) => refsIn(cellOf(d, name)).l.find((l) => prefixOf(l.code) === 'S')?.code;
    const from = pick('from');
    const to = pick('to');
    if (!from || !states.has(from) || !to || !states.has(to)) {
      add('error', 'M02', a, d.line, `${d.code}: From and To must be state codes (S-nn) defined in this SPEC`);
      continue;
    }
    if (states.get(from).machine !== states.get(to).machine) {
      add('error', 'M02', a, d.line, `${d.code}: ${from} and ${to} belong to different machines`);
      continue;
    }
    const t = { d, from, to, event: cellOf(d, 'event').trim().toLowerCase(), guardText: cellOf(d, 'guard').trim() };
    t.guard = parseGuard(t.guardText);
    if (!t.guard.ok) stats.guardFreeText++;
    else {
      const sat = guardSatisfiable(t.guard);
      if (sat.overlap === false) {
        t.dead = true;
        stats.guardInfeasible++;
        add('error', 'M10', a, d.line, `${d.code}: guard "${trunc(t.guardText, 50)}" can never hold (it contradicts itself), so the transition never fires. Fix the guard or remove the transition`);
      } else if (sat.unknown) add('warn', 'M09', a, d.line, `${d.code}: guard "${trunc(t.guardText, 50)}" compares a variable in two different ways; whether it can hold is not checked`);
    }
    trans.push(t);
    states.get(from).out.push(t);
  }
  const machines = new Map();
  for (const [code, s] of states) {
    if (!machines.has(s.machine)) machines.set(s.machine, []);
    machines.get(s.machine).push(code);
  }
  for (const [name, codes] of machines) {
    const label = name ? `machine "${name}"` : 'state machine';
    const inits = codes.filter((c) => states.get(c).kind === 'initial');
    if (inits.length !== 1) {
      add('error', 'M01', a, states.get(codes[0]).d.line, `${label} needs exactly one initial state (has ${inits.length})`);
      continue;
    }
    const seen = new Set(inits);
    const queue = [...inits];
    while (queue.length) for (const t of states.get(queue.shift()).out) if (!t.dead && !seen.has(t.to)) seen.add(t.to) && queue.push(t.to);
    for (const c of codes) {
      const s = states.get(c);
      const live = s.out.filter((t) => !t.dead);
      if (!seen.has(c)) add('error', 'M03', a, s.d.line, `${c} (${s.name}) is unreachable from ${inits[0]}${trans.some((t) => t.dead && t.to === c) ? ' (only through a guard that can never hold)' : ''}`);
      if (s.kind !== 'terminal' && !live.length) add('error', 'M04', a, s.d.line, `${c} (${s.name}) is not terminal but has no outgoing transition${s.out.length ? ' that can fire' : ''}`);
      if (s.kind === 'terminal' && s.out.length) add('error', 'M05', a, s.d.line, `${c} (${s.name}) is terminal but has outgoing ${s.out.map((t) => t.d.code).join(', ')}`);
    }
  }
  const groups = new Map();
  for (const t of trans.filter((x) => !x.dead)) {
    const k = `${t.from}|${t.event}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(t);
  }
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    stats.guardGroups++;
    let unverified = false;
    let overlap = false;
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        const [x, y] = [list[i], list[j]];
        if (!x.guard.ok || !y.guard.ok) {
          unverified = true;
          const bad = [x, y].filter((t) => !t.guard.ok).map((t) => `${t.d.code} "${trunc(t.guardText, 40)}"${t.guard.reason ? ` (${t.guard.reason})` : ''}`).join(', ');
          add('warn', 'M09', a, y.d.line, `cannot prove ${x.d.code} and ${y.d.code} exclude each other: guard not in the checkable form (${bad}). Write it as comparisons such as "balance >= 2 and paid", "role = hr", "R-05" / "not R-05", or move the condition into a decision table`);
          continue;
        }
        const o = guardsOverlap(x.guard, y.guard);
        if (o.unknown) {
          unverified = true;
          add('warn', 'M09', a, y.d.line, `cannot prove ${x.d.code} and ${y.d.code} exclude each other: a variable is compared in two different ways`);
        } else if (o.overlap) {
          overlap = true;
          add('error', 'M06', a, y.d.line, `${x.d.code} and ${y.d.code} (${x.from}, "${x.event}") can both fire, e.g. when ${o.witness}: nondeterministic. Make the guards exclusive`);
        }
      }
    if (overlap) stats.guardOverlap++;
    else if (unverified) stats.guardUnverified++;
    else stats.guardExclusive++;
  }

  // Decision tables
  for (const t of a.tables.filter((x) => x.decision)) {
    const rule = RE.code.exec(t.decision.rule);
    const rcode = rule ? normCode(rule[1], rule[2]) : t.decision.rule;
    if (!rule || prefixOf(rcode) !== 'R' || !a.defs.has(rcode)) add('error', 'K01', a, t.decision.line, `decision table names ${t.decision.rule}, which is not a rule defined in ${a.id}`);
    const ci = t.header.map((h, i) => (/^C\s*:/i.test(h) ? i : -1)).filter((i) => i >= 0);
    const ai = t.header.map((h, i) => (/^A\s*:/i.test(h) ? i : -1)).filter((i) => i >= 0);
    if (!ci.length || !ai.length) {
      add('error', 'K02', a, t.line, 'decision table needs condition columns "C: ..." and action columns "A: ..."');
      continue;
    }
    if (ci.length > 12) {
      add('error', 'K07', a, t.line, 'decision table has more than 12 conditions; split the rule');
      continue;
    }
    const rows = [];
    for (const r of t.rows) {
      const vals = ci.map((i) => (r.cells[i] || '').trim().toUpperCase());
      if (vals.some((v) => !['Y', 'N', '-'].includes(v))) {
        add('error', 'K02', a, r.line, 'condition cells must be Y, N or -');
        continue;
      }
      const acts = ai.map((i) => (r.cells[i] || '').trim());
      if (acts.some((v) => isBlank(v))) add('error', 'K06', a, r.line, 'action cell is empty');
      rows.push({ r, vals, key: acts.join(' | ').toLowerCase() });
    }
    const n = ci.length;
    const missing = [];
    const pairs = new Set();
    for (let mask = 0; mask < 1 << n; mask++) {
      const hit = rows.filter((x) => x.vals.every((v, i) => v === '-' || (v === 'Y') === Boolean(mask & (1 << i))));
      if (!hit.length) {
        if (missing.length < 4) missing.push(ci.map((c, i) => `${t.header[c].replace(/^C\s*:\s*/i, '')}=${mask & (1 << i) ? 'Y' : 'N'}`).join(', '));
        missing.count = (missing.count || 0) + 1;
      }
      for (let i = 0; i < hit.length; i++)
        for (let j = i + 1; j < hit.length; j++) {
          const k = `${hit[i].r.line}:${hit[j].r.line}`;
          if (pairs.has(k)) continue;
          pairs.add(k);
          if (hit[i].key !== hit[j].key) add('error', 'K04', a, hit[j].r.line, `rows at L${hit[i].r.line} and L${hit[j].r.line} overlap with different actions (contradiction)`);
          else add('warn', 'K05', a, hit[j].r.line, `rows at L${hit[i].r.line} and L${hit[j].r.line} overlap (redundant)`);
        }
    }
    if (missing.length) add('error', 'K03', a, t.line, `decision table for ${rcode} misses ${missing.count} combination(s), e.g. ${missing.join(' / ')}`);
  }

  // Heuristics for weak acceptance criteria (warnings: they point a reviewer at likely gaps)
  const words = (s) => new Set(String(s).toLowerCase().replace(/\b[A-Z]*-?\d+[\w./-]*/gi, ' ').match(/[\p{L}]{3,}/gu) || []);
  const acsFor = (code) => defsOf('AC').filter((ac) => {
    const r = refsIn(defText(ac));
    return r.l.some((l) => l.code === code) || r.q.some((q) => q.art === a.id && q.code === code);
  });
  for (const ac of defsOf('AC').filter((x) => x.kind === 'row')) {
    const body = ['given', 'when', 'then'].map((c) => cellOf(ac, c)).join(' ');
    if (/\d/.test(body)) continue;
    for (const l of refsIn(cellOf(ac, 'covers')).l.filter((x) => prefixOf(x.code) === 'R')) {
      const rule = a.defs.get(l.code);
      if (!rule || rule.kind !== 'row') continue;
      const A = words(body), B = words(cellOf(rule, 'rule'));
      const inter = [...A].filter((w) => B.has(w)).length;
      if (A.size && B.size && inter / new Set([...A, ...B]).size >= 0.6)
        add('warn', 'H01', a, ac.line, `${ac.code} mostly restates ${l.code}; give concrete values and the observable result`);
    }
  }
  const THRESHOLD = /(>=|<=|≥|≤|[<>]\s*\d|at least|at most|more than|less than|or more|or less|up to|minimum|maximum|tối thiểu|tối đa|ít nhất|nhiều nhất|trở lên|trở xuống|vượt quá)/i;
  for (const r of defsOf('R').filter((x) => x.kind === 'row')) {
    const text = cellOf(r, 'rule');
    if (THRESHOLD.test(text) && /\d/.test(text) && acsFor(r.code).length < 2)
      add('warn', 'H03', a, r.line, `${r.code} has a numeric threshold but ${acsFor(r.code).length} AC; test at the boundary and just past it`);
  }
  const REFUSAL = /(refus|reject|den(y|ied)|forbid|not allowed|unauthori[sz]ed|\b40[13]\b|blocked|từ chối|không được|không cho)/i;
  for (const p of defsOf('P').filter((x) => x.kind === 'row')) {
    const restricted = p.cells.some((c, i) => i > col(p.table, 'action') && col(p.table, 'action') >= 0 && !/^Y$/i.test(c.trim()));
    if (restricted && !acsFor(p.code).some((ac) => REFUSAL.test(defText(ac))))
      add('warn', 'H04', a, p.line, `${p.code} forbids some actors, but no AC shows the refusal`);
  }
}


// ─── Graph (trace / impact / coverage) ──────────────────────────────────────────────────────────

function buildGraph(tree) {
  const up = new Map();
  const down = new Map();
  const nodes = new Map();
  const link = (from, to) => {
    if (!up.has(from)) up.set(from, new Set());
    up.get(from).add(to);
    if (!down.has(to)) down.set(to, new Set());
    down.get(to).add(from);
  };
  for (const a of tree.arts) {
    if (!a.type || a.type === 'SRC' || tree.byId.get(a.id) !== a) continue;
    for (const d of a.defList) {
      const key = `${a.id}/${d.code}`;
      nodes.set(key, { a, d });
      const r = refsIn(defText(d));
      for (const q of r.q) link(key, `${q.art}/${q.code}`);
      for (const c of r.c) link(key, `${c.art}#L${c.from}${c.to !== c.from ? `-L${c.to}` : ''}`);
      for (const c of r.k) link(key, `code:${c.file}#L${c.from}${c.to !== c.from ? `-L${c.to}` : ''}`);
      for (const l of r.l) if (l.code !== d.code && a.defs.has(l.code)) link(key, `${a.id}/${l.code}`);
    }
  }
  return { up, down, nodes };
}

function describe(tree, g, key) {
  const n = g.nodes.get(key);
  if (n) return `${key}  ${n.a.rel}:${n.d.line}  ${defSummary(n.d)}${n.a.status !== 'approved' ? `  [${n.a.status}]` : ''}`;
  const k = key.match(/^code:(.+)#L(\d+)/);
  if (k) return `${key}  ${k[1]}:${k[2]}  (code, at the SPEC's code_ref)`;
  const c = key.match(/^(SRC-\d+)#L(\d+)/);
  if (c) {
    const s = tree.byId.get(c[1]);
    if (s) return `${key}  ${s.rel}:${c[2]}  "${trunc(s.lines[Number(c[2]) - 1], 60)}"`;
  }
  return `${key}  (unresolved)`;
}

function printTree(tree, g, start, dir, tests, out, depth = 1, seen = new Set([start])) {
  const next = [...(dir === 'up' ? g.up.get(start) || [] : g.down.get(start) || [])].sort();
  for (const k of next) {
    out.push(`${'  '.repeat(depth)}${describe(tree, g, k)}`);
    if (dir === 'down' && tests && /\/AC-\d+$/.test(k)) for (const h of tests.filter((x) => x.key === k)) out.push(`${'  '.repeat(depth + 1)}test ${h.file}:${h.line}`);
    if (!seen.has(k) && depth < 8) {
      seen.add(k);
      printTree(tree, g, k, dir, tests, out, depth + 1, seen);
    }
  }
  if (dir === 'down' && depth === 1 && tests && /\/AC-\d+$/.test(start)) for (const h of tests.filter((x) => x.key === start)) out.push(`  test ${h.file}:${h.line}`);
}

function resolveRef(tree, ref) {
  const s = String(ref).trim();
  const m = s.match(new RegExp(`^(${TYPE_ALT})-(\\d+)(?:/(${CODE_ALT})-(\\d{2,3}))?$`, 'i'));
  if (!m) throw new CliError(`cannot read "${ref}"; use an id like SPEC-2 or an item like SPEC-2/R-03`);
  const id = `${m[1].toUpperCase()}-${Number(m[2])}`;
  const a = tree.byId.get(id);
  if (!a) throw new CliError(`${id} does not exist`);
  if (!m[3]) return { a, key: id };
  const code = normCode(m[3].toUpperCase(), m[4]);
  if (!a.defs.has(code)) {
    const rev = tree.revisions.get(id);
    if (rev && rev.defs.has(code)) return { a: rev, code, key: `${id}/${code}`, revision: true };
    throw new CliError(`${code} is not defined in ${id}`);
  }
  return { a, code, key: `${id}/${code}` };
}

// ─── Templates ──────────────────────────────────────────────────────────────────────────────────

const FM = (id, title, version, owner, extra = []) =>
  ['---', `id: ${id}`, `title: ${title}`, `version: ${version}`, 'status: draft', `owner: ${owner}`, ...extra, 'supersedes:', 'approved_by:', 'approved_at:', 'approved_hash:', '---', ''].join('\n');
const CHANGELOG = '\n## Change log\n\n| Version | Date | By | Change |\n| --- | --- | --- | --- |\n';

export const TEMPLATES = {
  SRC: (id, title, o) =>
    `${FM(id, title, '1.0.0', o.owner, [`kind: ${o.kind || 'document'}`, `received: ${o.received || today()}`, `from: ${o.from || ''}`])}${o.content ?? '<!-- Paste the source verbatim below this comment. Do not summarize, translate or fix it. Cite it as ' + id + '#L<line>. Once approved it never changes; add a new SRC with supersedes: to replace it. -->\n'}`,
  BRIEF: (id, title, o) => `${FM(id, title, '0.1.0', o.owner)}
# ${id}: ${title}

<!-- Skyline BRIEF: why, for whom, what. Every row cites the exact source lines (SRC-n#Lx). Nothing without a source; each unknown becomes a CLARIFY marker holding a one-sentence question. -->

## 1. Problem

<!-- Two to five sentences, each ending with its citation. -->

## 2. Goals

| Code | Goal | Success measure | Source |
| --- | --- | --- | --- |

## 3. Non-goals

| Code | Non-goal | Source |
| --- | --- | --- |

## 4. Actors

| Code | Actor | Description | Source |
| --- | --- | --- | --- |

## 5. Capabilities

| Code | Capability | Priority | Source |
| --- | --- | --- | --- |

## 6. Constraints

| Code | Constraint | Source |
| --- | --- | --- |

## 7. Assumptions

| Code | Assumption | Validate by |
| --- | --- | --- |

## 8. Risks

| Code | Risk | Impact | Mitigation |
| --- | --- | --- | --- |
${CHANGELOG}`,
  SPEC: (id, title, o) => `${FM(id, title, '0.1.0', o.owner, [`flow: ${o.flow}`, ...(o.flow === 'adopt' ? [`code_ref: ${o.codeRef}`] : []), `risk: ${o.risk || 'normal'}`, 'review:', `parent: [${o.pins.join(', ')}]`])}
# ${id}: ${title}

<!-- Skyline SPEC (${o.flow} flow): the exact logic. One row, one fact. Bare codes (R-01) are this SPEC; anything else is qualified (BRIEF-1/C-02). Every rule has a Source and at least one AC. Each unknown becomes a CLARIFY marker; never guess.${o.flow === 'adopt' ? ` Adopt flow: Sources may cite code as code:path#L10-L20, read at code_ref ${o.codeRef}; describe what the code does, and mark anything that looks wrong with a CLARIFY marker for the owner.` : ''} -->

## 1. Scope

<!-- ${o.flow === 'project' ? 'One sentence: which capabilities this SPEC implements, e.g. "Implements BRIEF-1/C-01 and BRIEF-1/C-02."' : o.flow === 'adopt' ? 'One sentence: which module or behaviour of the running system this SPEC describes, with its code paths.' : 'One or two sentences: what is being asked and by whom, each ending with its citation (SRC-n#Lx).'} -->

## 2. Glossary

| Code | Term | Definition | Source |
| --- | --- | --- | --- |

## 3. Data

| Code | Field | Type | Required | Constraint | Source |
| --- | --- | --- | --- | --- | --- |

## 4. States

| Code | Machine | State | Kind |
| --- | --- | --- | --- |

| Code | From | Event | Guard | To | Rules |
| --- | --- | --- | --- | --- | --- |

## 5. Rules

| Code | Rule | Source |
| --- | --- | --- |

<!-- A rule with two or more conditions gets a decision table: put an HTML comment "decision: R-nn" on the line above a table whose condition columns are "C: ..." (cells Y, N or -) and action columns "A: ...". -->

## 6. Permissions

<!-- Columns after Action are actors: BRIEF-n/A-nn. Cells: Y, N, or a rule code (R-nn) meaning "allowed when that rule holds". -->

| Code | Action |
| --- | --- |

## 7. Flows

<!-- One "### F-01 Name" heading per flow, then numbered steps. Each step names the rule or transition it exercises. Include the error and alternative paths. -->

## 8. Acceptance criteria

| Code | Given | When | Then | Covers |
| --- | --- | --- | --- | --- |

## 9. Non-functional

| Code | Quality | Measure | Target | Source |
| --- | --- | --- | --- | --- |

## 10. Assumptions

| Code | Assumption | Validate by |
| --- | --- | --- |

## 11. Out of scope

<!-- Bullets, each with its source. -->
${CHANGELOG}`,
  DSN: (id, title, o) => `${FM(id, title, '0.1.0', o.owner, [`risk: ${o.risk || 'normal'}`, 'review:', `parent: [${o.pins.join(', ')}]`])}
# ${id}: ${title}

<!-- Skyline DESIGN: how the SPEC is built. Every rule of the parent SPEC gets an RZ row, every data field a DM row. Decisions list options; the owner chooses and the choice cites the owner's words (SRC). -->

## 1. Scope

## 2. Components

| Code | Component | Responsibility | Path |
| --- | --- | --- | --- |

## 3. Data mapping

| Code | Spec field | Storage | Notes |
| --- | --- | --- | --- |

## 4. Interfaces

| Code | Operation | Input | Output | Errors | Covers |
| --- | --- | --- | --- | --- | --- |

## 5. Rule realization

| Code | Spec rule | Component | Enforcement |
| --- | --- | --- | --- |

## 6. Decisions

| Code | Question | Options | Chosen | Source |
| --- | --- | --- | --- | --- |

## 7. Implementation constraints

| Code | Constraint | Source |
| --- | --- | --- |

## 8. Risks

| Code | Risk | Impact | Mitigation |
| --- | --- | --- | --- |

## 9. Diagrams

<!-- Optional mermaid blocks. One diagram answers one question, 15 nodes or fewer, labels in double quotes, item codes on nodes. -->
${CHANGELOG}`,
  PLAN: (id, title, o) => `${FM(id, title, '0.1.0', o.owner, [`parent: [${o.pins.join(', ')}]`])}
# ${id}: ${title}

<!-- Skyline PLAN: how and in which order. A working document: never approved, edit it freely as the work evolves. The checker still requires an RZ row for every rule and a DM row for every data field of the SPEC (unless a DSN holds them), a task for every acceptance criterion, and the owner's words (SRC) behind every decision. -->

## 1. Scope

## 2. Components

| Code | Component | Change | Path |
| --- | --- | --- | --- |

## 3. Data mapping

| Code | Spec field | Storage | Notes |
| --- | --- | --- | --- |

## 4. Interfaces

| Code | Operation | Input | Output | Errors | Covers |
| --- | --- | --- | --- | --- | --- |

## 5. Rule realization

| Code | Spec rule | Component | Enforcement |
| --- | --- | --- | --- |

## 6. Decisions

| Code | Question | Options | Chosen | Source |
| --- | --- | --- | --- | --- |

## 7. Tasks

| Done | Code | Task | Covers | Files | Depends |
| --- | --- | --- | --- | --- | --- |

## 8. Notes
`,
};

// ─── Commands ───────────────────────────────────────────────────────────────────────────────────

const BOOL = new Set(['json', 'tests', 'stdin', 'help', 'all', 'with-sources', 'branches', 'strict', 'quiet', 'pending']);
function parseArgs(argv) {
  const pos = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x.startsWith('--')) {
      const [k, v] = x.slice(2).split(/=(.*)/s);
      if (v !== undefined) flags[k] = v;
      else if (BOOL.has(k) || i + 1 >= argv.length || argv[i + 1].startsWith('--')) flags[k] = true;
      else flags[k] = argv[++i];
    } else pos.push(x);
  }
  return { pos, flags };
}

function refuseAgent(cmd) {
  if (process.env.CLAUDECODE)
    throw new CliError(`\`skyline ${cmd}\` is owner-only and refuses to run inside an agent session. Run it yourself in a separate terminal: node .skyline/skyline.mjs ${cmd} ...`, 3);
}

function writeFile(abs, text) {
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text);
}

const flagText = (v) => (v === true || v === undefined ? '' : String(v));

function nextNumber(repo, tree, type, git = gitHelper(repo.dir)) {
  const local = tree.arts.filter((a) => a.type === type).map((a) => a.num);
  for (const f of walk(path.join(tree.root, TYPES[type].dir))) {
    const m = RE.artifactFile.exec(path.basename(f));
    if (m && m[1] === type) local.push(Number(m[2]));
  }
  const other = branchArtifacts(repo, git);
  const remote = other.files.filter((f) => f.type === type).map((f) => f.num);
  return { num: Math.max(0, ...local, ...remote) + 1, refs: other.refs };
}

function cmdInit(flags) {
  const dir = process.cwd();
  const cfgPath = path.join(dir, '.skyline', 'config.json');
  if (fs.existsSync(cfgPath)) throw new CliError('.skyline/config.json already exists');
  const root = flagText(flags.root) || DEFAULT_CONFIG.root;
  const config = { skyline: VERSION, project: flagText(flags.project) || path.basename(dir), owner: flagText(flags.owner), root };
  writeFile(cfgPath, `${JSON.stringify(config, null, 2)}\n`);
  writeFile(path.join(dir, '.skyline', 'skyline.mjs'), fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
  for (const t of TYPE_NAMES) writeFile(path.join(dir, root, TYPES[t].dir, '.gitkeep'), '');
  writeFile(
    path.join(dir, root, 'README.md'),
    `# Specs\n\nSkyline artifacts: \`src/\` verbatim sources, \`brief/\`, \`spec/\`, \`design/\`, \`plan/\`.\n\n- Check: \`node .skyline/skyline.mjs check\` (\`--tests\`: every acceptance criterion has a test; \`--branches\`: no id clash with other branches).\n- Approve (owner only, in your own terminal): \`node .skyline/skyline.mjs approve SPEC-1 --by <name> --with-sources\`.\n`,
  );
  console.log(`Initialized Skyline in ${dir}\n  config    .skyline/config.json\n  checker   .skyline/skyline.mjs (for CI: node .skyline/skyline.mjs check)\n  artifacts ${root}/{${TYPE_NAMES.map((t) => TYPES[t].dir).join(',')}}`);
}

function cmdUpgrade() {
  refuseAgent('upgrade');
  const repo = requireRepo();
  const vend = path.join(repo.dir, '.skyline', 'skyline.mjs');
  const self = fileURLToPath(import.meta.url);
  if (path.resolve(self) === path.resolve(vend)) throw new CliError('run upgrade with the plugin CLI (lib/skyline.mjs inside the plugin), not with the vendored copy');
  fs.copyFileSync(self, vend);
  const cfgPath = path.join(repo.dir, '.skyline', 'config.json');
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  cfg.skyline = VERSION;
  fs.writeFileSync(cfgPath, `${JSON.stringify(cfg, null, 2)}\n`);
  console.log(`Vendored checker updated to ${VERSION}. Run \`skyline check\` to see what the new version reports.`);
}

async function cmdNew(pos, flags) {
  const repo = requireRepo();
  const tree = loadTree(repo);
  const type = String(pos[0] || '').toUpperCase();
  const title = pos[1];
  if (!TYPES[type]) throw new CliError(`usage: skyline new <${TYPE_NAMES.join('|')}> "<title>" [--parent ID,ID] [--flow feature|project|adopt] [--supersedes ID]`);
  if (!title) throw new CliError('a title is required');
  const spec = TYPES[type];
  const parents = parseList(flagText(flags.parent));
  if (spec.required && !parents.length) throw new CliError(`a ${type} needs --parent ${spec.parents.join('|')}-n (comma-separated for several)`);
  if (!spec.parents.length && parents.length) throw new CliError(`a ${type} has no parents`);
  const pinned = parents.map((pid) => {
    const p = tree.byId.get(normId(pid) || pid);
    if (!p) throw new CliError(`parent ${pid} does not exist`);
    if (!spec.parents.includes(p.type)) throw new CliError(`parent of a ${type} must be ${spec.parents.join(' or ')}`);
    if (FINAL.has(p.status)) throw new CliError(`parent ${p.id} is ${p.status}`);
    return p;
  });
  const pins = pinned.map((p) => `${p.id}@${p.version}`);
  let flow;
  let codeRef;
  if (type === 'SPEC') {
    flow = flagText(flags.flow) || (pinned.some((p) => p.type === 'BRIEF') ? 'project' : 'feature');
    if (!FLOWS.includes(flow)) throw new CliError(`--flow must be one of ${FLOWS.join(', ')}`);
    if (flow === 'project' && !pinned.some((p) => p.type === 'BRIEF')) throw new CliError('a project-flow SPEC needs --parent BRIEF-n');
    if (flow === 'adopt') {
      codeRef = flagText(flags['code-ref']) || gitHelper(repo.dir).head();
      if (!codeRef) throw new CliError('the adopt flow needs a git commit to cite code at: commit first, or pass --code-ref <sha>');
    }
  }
  if (type === 'PLAN') {
    for (const p of pinned)
      if (p.type === 'SPEC' && p.fm.flow === 'project') throw new CliError(`${p.id} follows the project flow: plan it from its DSN (--parent DSN-n)`);
  }
  const { num, refs } = nextNumber(repo, tree, type);
  const id = `${type}-${num}`;
  let content;
  if (type === 'SRC') {
    if (flags.file) content = fs.readFileSync(path.resolve(flagText(flags.file)), 'utf8').replace(/^﻿/, '');
    else if (flags.stdin)
      content = await new Promise((res) => {
        let s = '';
        process.stdin.on('data', (d) => (s += d));
        process.stdin.on('end', () => res(s));
      });
    if (content !== undefined && !content.endsWith('\n')) content += '\n';
  }
  const risk = flagText(flags.risk) || 'normal';
  if (!['normal', 'high'].includes(risk)) throw new CliError('--risk must be normal or high');
  let text = TEMPLATES[type](id, title, { owner: flagText(flags.owner) || repo.config.owner || '', pins, flow, codeRef, risk, kind: flagText(flags.kind), from: flagText(flags.from), received: flagText(flags.received), content });
  if (flags.supersedes) {
    const s = tree.byId.get(normId(flags.supersedes) || '');
    if (!s || s.type !== type) throw new CliError(`--supersedes must name an existing ${type}`);
    text = setFrontmatter(text, { supersedes: s.id });
  }
  const abs = path.join(tree.root, TYPES[type].dir, `${id}-${slugify(title)}.md`);
  writeFile(abs, text);
  console.log(`Created ${id}${flow ? ` (${flow} flow)` : ''}: ${toPosix(path.relative(repo.dir, abs))}${pins.length ? `  parent ${pins.join(', ')}` : ''}`);
  console.log(`  number chosen after scanning the working tree${refs ? ` and ${refs} branch ref(s); run git fetch first to see new remote work` : ''}`);
  if (type === 'SRC') console.log(`  body starts at L${parseFrontmatter(text).end + 1}; cite it as ${id}#L<line>`);
  if (flow === 'adopt') console.log(`  code cites (code:path#L10-L20) are read at ${codeRef}`);
}

function cmdRevise(pos, flags) {
  const repo = requireRepo();
  const tree = loadTree(repo);
  const id = normId(pos[0]);
  const base = id && tree.byId.get(id);
  if (!base) throw new CliError('usage: skyline revise <ID> --level patch|minor|major --reason "<why, citing SRC-n>"');
  if (base.type === 'SRC') throw new CliError(`sources never change; add a new one: skyline new SRC "<title>" --file <path> --supersedes ${id}`);
  if (!TYPES[base.type].gated) throw new CliError(`${base.type} is a working document; edit it directly`);
  if (base.status !== 'approved') throw new CliError(`${id} is ${base.status}; edit it directly`);
  const existing = tree.revisions.get(id);
  if (existing) throw new CliError(`${id} already has a revision: ${existing.rel}`);
  const level = flagText(flags.level);
  if (!['patch', 'minor', 'major'].includes(level)) throw new CliError('--level patch|minor|major is required (patch: wording only; minor: items added or narrowed; major: meaning changed or items removed)');
  const reason = flagText(flags.reason).replace(/\s+/g, ' ').trim();
  if (!reason) throw new CliError('--reason "<why>" is required; cite the source of the change (SRC-n)');
  const v = bump(base.version, level);
  const updates = { version: v, status: 'draft', approved_by: '', approved_at: '', approved_hash: '', revises: base.version, revision_reason: reason };
  if ('review' in base.fm) updates.review = '';
  if (flags.risk) updates.risk = flagText(flags.risk);
  if (flags.risk && !['normal', 'high'].includes(updates.risk)) throw new CliError('--risk must be normal or high');
  if (level === 'major') {
    if (updates.risk === 'normal') throw new CliError('a major revision changes meaning or removes items; it is always risk: high');
    updates.risk = 'high';
  }
  const text = setFrontmatter(base.text, updates);
  const abs = base.abs.replace(/\.md$/, '.rev.md');
  writeFile(abs, text);
  console.log(`Created revision ${id} ${v} (of ${base.version}, ${level}): ${toPosix(path.relative(repo.dir, abs))}`);
  if (level === 'major') console.log('  major revision: risk set to high; run skyline:review and skyline review-stamp before asking for approval');
  console.log(`  ${base.version} stays in force until the owner approves: node .skyline/skyline.mjs approve ${id} --by <owner> --with-sources`);
}

function cmdReviewStamp(pos, flags) {
  const repo = requireRepo();
  const tree = loadTree(repo);
  const id = normId(pos[0]);
  const a = id && tree.target(id);
  if (!a || !['SPEC', 'DSN', 'BRIEF', 'PLAN'].includes(a.type)) throw new CliError('usage: skyline review-stamp <ID> [--report <path>] [--note "<what changed since the last stamp>"]');
  if (a.status !== 'draft') throw new CliError(`${id} is ${a.status}; reviews are stamped on drafts and revisions (skyline revise ${id} ...)`);
  const rel = flagText(flags.report) || `${repo.config.root}/review/${a.id}-${a.version}.md`;
  const abs = path.resolve(repo.dir, rel);
  if (!fs.existsSync(abs)) throw new CliError(`${rel} does not exist; write the review report first (skyline:review)`);
  const relPosix = toPosix(path.relative(repo.dir, abs));
  let text = fs.readFileSync(abs, 'utf8');
  const hash = reviewHash(a.text, a.type);
  const { fm } = parseFrontmatter(text);
  const note = flagText(flags.note).replace(/\s+/g, ' ').trim();
  if (fm) {
    if (!isBlank(fm.review_of) && (normId(fm.review_of) !== a.id || fm.version !== a.version))
      throw new CliError(`${relPosix} reviews ${fm.review_of} ${fm.version}; write a new report for ${a.id} ${a.version}`);
    if (!isBlank(fm.reviewed_hash) && fm.reviewed_hash === hash) {
      console.log(`${relPosix} is already stamped for ${a.id} ${a.version} (${hash}).`);
    } else {
      if (!isBlank(fm.reviewed_hash) && !note)
        throw new CliError(`${a.id} changed since the review was stamped. Have the changed items reviewed, then stamp again with --note "<what changed and who checked it>"; the note is kept in the report`);
      if (!isBlank(fm.reviewed_hash)) text = appendSection(text, 'Re-stamps', ['Date', 'From', 'To', 'Note'], [today(), fm.reviewed_hash, hash, note]);
      text = setFrontmatter(text, { review_of: a.id, version: a.version, reviewed_hash: hash });
      fs.writeFileSync(abs, text);
      console.log(`Stamped ${relPosix}: ${a.id} ${a.version} ${hash}`);
    }
  } else {
    fs.writeFileSync(abs, `---\nreview_of: ${a.id}\nversion: ${a.version}\nreviewed_hash: ${hash}\n---\n\n${text.replace(/^\uFEFF/, '')}`);
    console.log(`Stamped ${relPosix}: ${a.id} ${a.version} ${hash}`);
  }
  if (a.fm.review !== relPosix) {
    fs.writeFileSync(a.abs, setFrontmatter(a.text, { review: relPosix }));
    console.log(`  ${a.id}${a.isRevision ? ' (revision)' : ''} review: ${relPosix}`);
  }
  console.log('  any later edit to the artifact makes the review stale (Q05) until it is re-checked and stamped again');
}

function appendSection(text, title, head, cells) {
  const nl = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  const row = `| ${cells.map((c) => String(c).replace(/\|/g, '\\|')).join(' | ')} |`;
  const h = lines.findIndex((l) => l.trim() === `## ${title}`);
  if (h < 0) {
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
    lines.push('', `## ${title}`, '', `| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, row, '');
    return lines.join(nl);
  }
  let last = h;
  for (let i = h + 1; i < lines.length && !/^##\s/.test(lines[i]); i++) if (lines[i].trim().startsWith('|')) last = i;
  lines.splice(last + 1, 0, row);
  return lines.join(nl);
}

function cmdDiscard(pos) {
  const repo = requireRepo();
  const tree = loadTree(repo);
  const id = normId(pos[0]);
  const rev = id && tree.revisions.get(id);
  if (!rev) throw new CliError(`${pos[0] || '<ID>'} has no pending revision`);
  fs.unlinkSync(rev.abs);
  console.log(`Discarded the revision of ${id} (${rev.rel}); ${tree.byId.get(id)?.version || 'the approved version'} stays in force.`);
  const pinned = tree.arts.filter((x) => x !== rev && x.pins?.some((p) => p.id === id && p.version === rev.version));
  if (pinned.length) console.log(`  ${pinned.map((x) => `${x.id}${x.isRevision ? ' (revision)' : ''}`).join(', ')} pinned ${id}@${rev.version}; re-pin: ${pinned.map((x) => `skyline repin ${x.id}`).join(' · ')}`);
}

function cmdDiff(pos) {
  const repo = requireRepo();
  const tree = loadTree(repo);
  const id = normId(pos[0]);
  const rev = id && tree.revisions.get(id);
  const base = id && tree.byId.get(id);
  if (!rev || !base) throw new CliError(`${pos[0] || '<ID>'} has no pending revision`);
  const r = spawnSync('git', ['diff', '--no-index', '--', base.rel, rev.rel], { cwd: repo.dir, encoding: 'utf8' });
  if (r.error) {
    const a = new Set(base.lines);
    const b = new Set(rev.lines);
    for (const l of base.lines) if (!b.has(l)) console.log(`- ${l}`);
    for (const l of rev.lines) if (!a.has(l)) console.log(`+ ${l}`);
    return;
  }
  process.stdout.write(r.stdout || 'no differences\n');
}

function cmdRepin(pos, flags = {}) {
  const repo = requireRepo();
  const tree = loadTree(repo);
  const id = normId(pos[0]);
  const a = id && tree.target(id);
  if (!a) throw new CliError('usage: skyline repin <ID> [--pending]');
  if (a.status !== 'draft') throw new CliError(`${id} is ${a.status}; create a revision first: skyline revise ${id} --level patch --reason "repin to current parents"`);
  const pins = a.pins.map((p) => {
    const pa = p.bad ? null : (flags.pending && tree.revisions.get(p.id)) || tree.byId.get(p.id);
    if (!pa) throw new CliError(`cannot re-pin ${p.raw}`);
    return `${pa.id}@${pa.version}`;
  });
  fs.writeFileSync(a.abs, setFrontmatter(a.text, { parent: `[${pins.join(', ')}]` }));
  console.log(`${id}${a.isRevision ? ' (revision)' : ''} parent: [${pins.join(', ')}]`);
}

function cmdRenumber(pos, flags) {
  const repo = requireRepo();
  const tree = loadTree(repo);
  const arg = String(pos[0] || '');
  let a;
  if (/\.md$/.test(arg)) {
    const abs = path.resolve(arg);
    a = tree.arts.find((x) => x.abs === abs);
    if (!a || !a.id) throw new CliError(`${arg} is not an artifact file`);
  } else {
    const id = normId(arg);
    const found = tree.arts.filter((x) => x.id === id && !x.isRevision);
    if (!found.length) throw new CliError('usage: skyline renumber <ID | path/to/file.md> [--to N]');
    if (found.length > 1) throw new CliError(`several files use ${id}; pass the path of the one to renumber:\n  ${found.map((x) => x.rel).join('\n  ')}`);
    a = found[0];
  }
  if (a.isRevision) throw new CliError('renumber the artifact, not its revision');
  if (a.status !== 'draft' || /\|\s*Approved\b/.test(a.text)) throw new CliError(`${a.id} has been approved; its id is frozen. Renumber the other draft instead.`);
  const oldId = a.id;
  const dup = tree.arts.some((x) => x !== a && x.id === oldId && !x.isRevision);
  const num = flags.to ? Number(String(flags.to).replace(/^[A-Za-z]+-/, '')) : nextNumber(repo, tree, a.type).num;
  if (!Number.isInteger(num) || num < 1) throw new CliError('--to must be a positive number');
  const newId = `${a.type}-${num}`;
  if (tree.arts.some((x) => x.id === newId)) throw new CliError(`${newId} already exists`);
  const rx = new RegExp(`\\b${oldId}\\b(?!\\d)`, 'g');
  const changed = [];
  const newAbs = path.join(path.dirname(a.abs), path.basename(a.abs).replace(new RegExp(`^${oldId}(?=[-.])`), newId));
  fs.writeFileSync(newAbs, a.text.replace(rx, newId));
  if (newAbs !== a.abs) fs.unlinkSync(a.abs);
  changed.push(toPosix(path.relative(repo.dir, newAbs)));
  const review = [];
  if (!dup) {
    for (const x of tree.arts) {
      if (x === a || !rx.test(x.text)) continue;
      rx.lastIndex = 0;
      if (x.status !== 'draft') {
        review.push(x.rel);
        continue;
      }
      fs.writeFileSync(x.abs, x.text.replace(rx, newId));
      changed.push(x.rel);
    }
    const qrx = new RegExp(`\\b${oldId}/`, 'g');
    const seen = new Set();
    for (const d of repo.config.testDirs || [])
      for (const f of walk(path.join(repo.dir, d))) {
        if (seen.has(f) || !/\.(m|c)?[jt]sx?$/.test(f)) continue;
        seen.add(f);
        const s = fs.readFileSync(f, 'utf8');
        if (!qrx.test(s)) continue;
        qrx.lastIndex = 0;
        fs.writeFileSync(f, s.replace(qrx, `${newId}/`));
        changed.push(toPosix(path.relative(repo.dir, f)));
      }
  } else {
    for (const x of tree.arts) if (x !== a && x.id !== oldId && rx.test(x.text)) review.push(x.rel), (rx.lastIndex = 0);
  }
  console.log(`${oldId} → ${newId}\nchanged:\n  ${changed.join('\n  ')}`);
  if (review.length)
    console.log(`${dup ? `${oldId} was duplicated, so references were not rewritten automatically.` : 'Approved artifacts mention the old id and were left untouched.'} Review:\n  ${review.join('\n  ')}`);
}

function printProblems(problems) {
  const groups = new Map();
  for (const p of problems) {
    const key = `${p.code} ${p.msg.replace(/^\S+: /, '')}`;
    if (!groups.has(key)) groups.set(key, { p, n: 0 });
    groups.get(key).n++;
  }
  for (const { p, n } of groups.values()) console.log(`${formatIssue(p)}${n > 1 ? `  (+${n - 1} more line${n > 2 ? 's' : ''})` : ''}`);
}

function approvalText(a, by, date, note) {
  let text = a.text;
  if (a.type !== 'SRC') text = appendChangelog(text, [a.version, date, by, note]);
  text = setFrontmatter(text, { revises: null, revision_reason: null, status: 'approved', approved_by: by, approved_at: date, approved_hash: '' });
  return setFrontmatter(text, { approved_hash: computeHash(text, a.type) });
}

function gate(tree, a, { skipReview = false } = {}) {
  const problems = checkTree(tree, { approving: a.abs }).filter((i) => i.file === a.rel && i.sev !== 'warn' && !(skipReview && ['Q04', 'Q05'].includes(i.code)));
  for (const p of a.pins) {
    const pa = p.bad ? null : tree.sees(a, p.id);
    if (!pa) continue;
    if (pa.isRevision) continue; // reported by the check as F14
    if (pa.status !== 'approved') problems.push({ sev: 'error', code: 'F07', file: a.rel, line: a.fmLines.parent, msg: `parent ${pa.id} is ${pa.status}; approve it first` });
    else if (majorMinor(p.version) !== majorMinor(pa.version) || cmpVer(p.version, pa.version) > 0)
      problems.push({ sev: 'error', code: 'F08', file: a.rel, line: a.fmLines.parent, msg: `pins ${p.raw} but ${pa.id} is ${pa.version}; run \`skyline repin ${a.id}\` and review` });
  }
  return problems;
}

function cmdApprove(pos, flags) {
  refuseAgent('approve');
  const repo = requireRepo();
  const by = flagText(flags.by) || repo.config.owner;
  if (isBlank(by)) throw new CliError('--by <owner name> is required');
  const date = flagText(flags.date) || today();
  if (!RE.date.test(date)) throw new CliError('--date must be YYYY-MM-DD');
  const ids = uniq(pos.map((x) => normId(x) || x));
  if (!ids.length) throw new CliError('usage: skyline approve <ID> [<ID> ...] --by <name> [--with-sources]');
  if (ids.length === 1) return approveOne(repo, ids[0], flags, by, date);
  // A revision set: parents before the artifacts that pin them, each gated on the state the previous left.
  const tree = loadTree(repo);
  for (const id of ids) if (!tree.target(id)) throw new CliError(`${id} does not exist`);
  const order = [];
  const left = [...ids];
  while (left.length) {
    const i = left.findIndex((id) => !tree.target(id).pins.some((p) => !p.bad && p.id !== id && left.includes(p.id)));
    if (i < 0) throw new CliError(`cannot order ${left.join(', ')}: they pin each other`);
    order.push(left.splice(i, 1)[0]);
  }
  console.log(`Approving in order: ${order.join(' → ')}`);
  const done = [];
  for (const id of order) {
    try {
      approveOne(repo, id, flags, by, date);
      done.push(id);
    } catch (e) {
      if (e instanceof CliError && done.length) e.message += `\nAlready approved in this run: ${done.join(', ')}. Not approved: ${order.slice(done.length).join(', ')}.`;
      throw e;
    }
  }
}

function approveOne(repo, id, flags, by, date) {
  let tree = loadTree(repo);
  let a = id && tree.target(id);
  if (!a) throw new CliError('usage: skyline approve <ID> --by <name> [--with-sources]');
  if (!TYPES[a.type].gated) throw new CliError(`${a.type} is a working document and is not approved; the checker covers it`);
  if (a.status !== 'draft') throw new CliError(`${id} is ${a.status}; to change it, create a revision (skyline revise ${id} ...)`);

  if (flags['with-sources']) {
    const srcIds = uniq(a.mentions.flatMap((m) => refsIn(m.text).c.map((c) => c.art)));
    const done = [];
    for (const sid of srcIds) {
      const s = tree.byId.get(sid);
      if (!s || s.status !== 'draft') continue;
      const probs = gate(tree, s);
      if (probs.length) {
        printProblems(probs);
        throw new CliError(`${sid} cannot be approved`, 1);
      }
      fs.writeFileSync(s.abs, approvalText(s, by, date, 'Approved'));
      done.push(sid);
    }
    if (done.length) {
      console.log(`Approved sources: ${done.join(', ')}`);
      tree = loadTree(repo);
      a = tree.target(id);
    }
  }

  const skipReview = flagText(flags['skip-review']).trim();
  if (flags['skip-review'] && !skipReview) throw new CliError('--skip-review needs a reason: --skip-review "<why no review is needed>"');
  const problems = gate(tree, a, { skipReview: Boolean(skipReview) });
  if (problems.length) {
    printProblems(problems);
    const open = problems.filter((p) => p.sev === 'open').length;
    const hint = problems.some((p) => /not approved \(approve it with --with-sources\)/.test(p.msg)) ? ' Add --with-sources to approve the cited sources in the same run.' : '';
    throw new CliError(`${id} cannot be approved: ${problems.length - open} error(s), ${open} open question(s).${hint}`, 1);
  }

  if (a.isRevision) {
    const base = tree.byId.get(id);
    const level = levelOf(base.version, a.version);
    fs.writeFileSync(base.abs, approvalText(a, by, date, `Approved revision of ${base.version} (${level}): ${a.fm.revision_reason || ''}${skipReview ? `; review skipped: ${skipReview}` : ''}`));
    fs.unlinkSync(a.abs);
    console.log(`Approved ${id} ${a.version} by ${by} on ${date}; it replaces ${base.version}.`);
    const kids = tree.children(id).filter((k) => !tree.revisions.get(k.id)?.pins.some((p) => p.id === id && p.version === a.version) && !k.pins.some((p) => p.id === id && p.version === a.version));
    if (kids.length && level !== 'patch')
      console.log(`Children now drift: ${kids.map((k) => `${k.id} (${k.type === 'PLAN' ? 'skyline repin' : 'revise, repin, approve'})`).join(', ')}.`);
    return;
  }
  const sup = isBlank(a.fm.supersedes) ? null : tree.byId.get(a.fm.supersedes);
  fs.writeFileSync(a.abs, approvalText(a, by, date, `Approved${sup ? `; supersedes ${sup.id}` : ''}${skipReview ? `; review skipped: ${skipReview}` : ''}`));
  if (sup && sup.status === 'approved') {
    fs.writeFileSync(sup.abs, setFrontmatter(sup.text, { status: 'superseded' }));
    console.log(`${sup.id} is now superseded.`);
  }
  console.log(`Approved ${id} ${a.version} by ${by} on ${date}.`);
}

export function verdict(tree, issues, stats, opts) {
  const gated = tree.arts.filter((a) => tree.inForce(a) && TYPES[a.type]?.gated && !FINAL.has(a.status));
  const approved = gated.filter((a) => a.status === 'approved');
  const drafts = gated.filter((a) => a.status !== 'approved').map((a) => a.id);
  const revs = [...tree.revisions.keys()];
  const t = stats?.tests;
  const specs = tree.arts.filter((a) => tree.inForce(a) && a.type === 'SPEC' && !FINAL.has(a.status));
  const highNoReview = [...specs, ...tree.arts.filter((a) => tree.inForce(a) && a.type === 'DSN')].filter((a) => a.fm.risk === 'high' && isBlank(a.fm.review)).map((a) => a.id);
  const g = stats || {};
  const guardLine = !g.guardGroups
    ? 'guard exclusivity: no state with two transitions on the same event'
    : `guard exclusivity: ${g.guardExclusive}/${g.guardGroups} transition group(s) proven exclusive${g.guardOverlap ? `, ${g.guardOverlap} overlapping (M06, errors)` : ''}${g.guardUnverified ? `, ${g.guardUnverified} not checkable (M09)` : ''}`;
  const machine = [
    'structure, ids, references, source line cites, version pins, required columns per row type',
    `every row has a source; open questions counted; state machines: reachability, dead ends, terminal states${g.guardInfeasible ? ` (${g.guardInfeasible} transition(s) with a guard that can never hold ignored, M10)` : ''}`,
    guardLine,
    'decision tables complete and consistent; permission matrices; rule → AC → realization → task links',
    !t
      ? 'tests: not checked (add --tests, and --results <file> to check they ran and passed)'
      : t.results
        ? `tests: ${t.passed}/${t.expected} AC(s) ran and passed in ${t.results} (the results file is the authority); ${t.linked}/${t.expected} also found in a non-skipped test title by the static scan`
        : `tests: ${t.linked}/${t.expected} AC(s) named in a non-skipped test title (static scan of the code, comments and strings ignored)`,
  ];
  if (opts.branches) machine.push('ids compared with other branches');
  const reviewed = [...specs, ...tree.arts.filter((a) => tree.inForce(a) && a.type === 'DSN' && !FINAL.has(a.status))].filter((a) => !isBlank(a.fm.review)).map((a) => a.id);
  const owner = [
    `${approved.length}/${gated.length} gated artifact(s) approved${drafts.length ? `; draft: ${drafts.join(', ')}` : ''}`,
    revs.length ? `pending revisions (not in force): ${revs.join(', ')}` : 'no pending revisions',
  ];
  if (reviewed.length) owner.push(`review reports bound to id, version and content hash: ${reviewed.join(', ')}`);
  const unverified = [
    'that each row means what its cited source means (people and skyline:review judge this)',
    'that each AC checks the right thing, beyond its links (review; warnings H01/H03/H04 point at likely gaps)',
  ];
  if (g.guardUnverified) unverified.push(`${g.guardUnverified} transition group(s) whose exclusivity the parser could not prove`);
  if (g.guardFreeText) unverified.push(`${g.guardFreeText} guard(s) in free text: whether they can hold is not checked`);
  if (!t) unverified.push('tests (not run with --tests)');
  else if (!t.results) unverified.push('test execution: not verified; a test named in the code may still fail or not run (add --results)');
  if (highNoReview.length) unverified.push(`high-risk artifacts without a review report: ${highNoReview.join(', ')}`);
  return { machine, owner, unverified };
}

export function formatIssue(i) {
  const sev = { error: 'ERROR', open: 'OPEN ', warn: 'warn ' }[i.sev];
  return `${sev} ${i.code} ${i.file}:${i.line}  ${i.msg}`;
}

function cmdCheck(pos, flags) {
  const repo = requireRepo();
  const tree = loadTree(repo);
  const results = flags.results ? String(flags.results).split(',').map((x) => x.trim()).filter(Boolean) : null;
  const opts = { tests: Boolean(flags.tests) || Boolean(results), branches: Boolean(flags.branches), strict: Boolean(flags.strict), results };
  let issues = checkTree(tree, opts);
  const stats = issues.stats;
  if (pos[0]) {
    const id = normId(pos[0]);
    if (!id || !tree.target(id)) throw new CliError(`${pos[0]} does not exist`);
    issues = issues.filter((i) => i.id === id);
  }
  const n = { error: 0, open: 0, warn: 0 };
  for (const i of issues) n[i.sev]++;
  const v = verdict(tree, issues, stats, opts);
  if (flags.json) console.log(JSON.stringify({ version: VERSION, summary: n, verdict: v, issues }, null, 2));
  else {
    for (const i of issues) console.log(formatIssue(i));
    const scope = pos[0] ? normId(pos[0]) : `${tree.arts.length} artifact(s)`;
    const mode = ['tests', 'branches', 'strict'].filter((k) => flags[k]).map((k) => ` --${k}`).join('') + (results ? ` --results ${results.join(',')}` : '');
    console.log(`${issues.length ? '\n' : ''}skyline ${VERSION} check ${scope}${mode}: ${n.error} error(s), ${n.open} open question(s), ${n.warn} warning(s)`);
    if (!flags.quiet) {
      console.log('\nMachine-checked in this run:');
      for (const l of v.machine) console.log(`  - ${l}`);
      console.log('Approved by the owner:');
      for (const l of v.owner) console.log(`  - ${l}`);
      console.log('Not verified by anything yet:');
      for (const l of v.unverified) console.log(`  - ${l}`);
    }
  }
  process.exitCode = n.error ? 1 : 0;
}

function cmdIndex() {
  const repo = requireRepo();
  const tree = loadTree(repo);
  const rows = [['id', 'status', 'version', 'flow', 'open', 'parent', 'title', 'file']];
  const order = (a) => TYPE_NAMES.indexOf(a.type) * 1e6 + a.num * 2 + (a.isRevision ? 1 : 0);
  for (const a of tree.arts.filter((x) => x.type).sort((x, y) => order(x) - order(y)))
    rows.push([
      a.isRevision ? `${a.id} rev` : a.id,
      a.status || '?',
      a.version || '?',
      a.type === 'SPEC' ? `${a.fm.flow || '?'}${a.fm.risk === 'high' ? ' !' : ''}` : a.type === 'DSN' && a.fm.risk === 'high' ? '!' : '-',
      String(a.markers.length),
      a.pins.map((p) => p.raw).join(',') || '-',
      trunc(a.fm.title, 36),
      a.rel,
    ]);
  const w = rows[0].map((_, i) => Math.max(...rows.map((r) => r[i].length)));
  for (const r of rows) console.log(r.map((c, i) => (i === r.length - 1 ? c : c.padEnd(w[i]))).join('  '));
  if (rows.length === 1) console.log('(no artifacts yet: skyline new SRC "<title>" --file <path>)');
}

function cmdShow(pos) {
  const repo = requireRepo();
  const tree = loadTree(repo);
  const arg = String(pos[0] || '');
  const bare = arg.match(new RegExp(`^(${CODE_ALT})-(\\d{2,3})$`, 'i'));
  if (bare) {
    const code = normCode(bare[1].toUpperCase(), bare[2]);
    const hits = tree.arts.filter((a) => a.type && a.type !== 'SRC' && a.defs.has(code));
    if (!hits.length) throw new CliError(`no artifact defines ${code}`);
    for (const a of hits) console.log(`${a.id}/${code}${a.isRevision ? ' (revision)' : ''}  ${a.status}  ${a.rel}:${a.defs.get(code).line}  ${defSummary(a.defs.get(code))}`);
    if (hits.length > 1) console.log(`\n${code} is ambiguous; always write it qualified (e.g. ${hits[0].id}/${code}).`);
    return;
  }
  const { a, code, key, revision } = resolveRef(tree, arg);
  if (!code) {
    const rev = tree.revisions.get(a.id);
    console.log(`${a.id}  ${a.fm.title}\n  file     ${a.rel}\n  status   ${a.status} ${a.version}${a.status === 'approved' ? ` by ${a.fm.approved_by} on ${a.fm.approved_at}` : ''}${a.type === 'SPEC' ? `\n  flow     ${a.fm.flow || '?'}` : ''}${['SPEC', 'DSN'].includes(a.type) ? `\n  risk     ${a.fm.risk || 'normal'}${isBlank(a.fm.review) ? '' : ` (review: ${a.fm.review})`}` : ''}`);
    if (rev) console.log(`  revision ${rev.version} draft (${rev.fm.revision_reason || ''}) ${rev.rel}`);
    console.log(`  parent   ${a.pins.map((p) => p.raw).join(', ') || '-'}\n  children ${tree.children(a.id).map((c) => c.id).join(', ') || '-'}\n  open     ${a.markers.length} marker(s)`);
    const counts = {};
    for (const d of a.defList) counts[prefixOf(d.code)] = (counts[prefixOf(d.code)] || 0) + 1;
    console.log(`  items    ${Object.entries(counts).map(([k, v]) => `${k}×${v}`).join(' ') || '-'}`);
    return;
  }
  const d = a.defs.get(code);
  console.log(`${key}  ${a.rel}:${d.line}  [${a.status} ${a.version}${revision ? ', only in the pending revision' : ''}]`);
  if (d.kind === 'row') d.table.header.forEach((h, i) => i !== d.codeIdx && console.log(`  ${h}: ${d.cells[i] || ''}`));
  else [d.title, ...d.body.map((b) => b.text)].forEach((l) => console.log(`  ${l}`));
  const refs = [];
  for (const x of tree.arts)
    for (const m of x.mentions || []) {
      const r = refsIn(m.text);
      if (r.q.some((q) => `${q.art}/${q.code}` === key) || (x === a && m.line !== d.line && r.l.some((l) => l.code === code))) refs.push(`  ${x.rel}:${m.line}  ${trunc(m.text, 90)}`);
    }
  if (refs.length) console.log(`mentioned at:\n${refs.join('\n')}`);
}

function cmdTrace(pos, flags, dirs) {
  const repo = requireRepo();
  const tree = loadTree(repo);
  const { a, code, key } = resolveRef(tree, pos[0] || '');
  const out = [];
  if (!code) {
    const up = [...ancestors(tree, a)].map((id) => tree.byId.get(id)).filter(Boolean);
    out.push(`${a.id}  ${a.status} ${a.version}  ${a.rel}`);
    if (dirs.includes('up')) out.push('upstream:', ...(up.length ? up.map((x) => `  ${x.id}  ${x.status} ${x.version}  ${x.rel}`) : ['  -']));
    if (dirs.includes('down')) {
      const dn = descendants(tree, a);
      out.push('downstream:', ...(dn.length ? dn.map((x) => `  ${x.id}  ${x.status} ${x.version}  ${x.rel}`) : ['  -']));
    }
    console.log(out.join('\n'));
    return;
  }
  const g = buildGraph(tree);
  const tests = code.startsWith('AC-') || dirs.includes('down') ? scanTests(repo).filter((h) => h.linked) : null;
  out.push(describe(tree, g, key));
  if (dirs.includes('up')) {
    out.push('upstream (what it rests on):');
    const before = out.length;
    printTree(tree, g, key, 'up', null, out);
    if (out.length === before) out.push('  - (no sources: this item rests on nothing)');
  }
  if (dirs.includes('down')) {
    out.push(dirs.length === 1 ? 'impact (what depends on it):' : 'downstream (what depends on it):');
    const before = out.length;
    printTree(tree, g, key, 'down', tests, out);
    if (out.length === before) out.push('  -');
  }
  console.log(out.join('\n'));
}

function cmdCoverage(pos) {
  const repo = requireRepo();
  const tree = loadTree(repo);
  const g = buildGraph(tree);
  const tests = scanTests(repo).filter((h) => h.linked);
  const targets = pos[0] ? [resolveRef(tree, pos[0]).a] : tree.arts.filter((a) => a.type === 'SPEC' && tree.inForce(a) && !FINAL.has(a.status));
  for (const s of targets) {
    console.log(`${s.id}  ${s.fm.title}  [${s.fm.flow || '?'} flow, ${s.status} ${s.version}]`);
    for (const d of s.defList.filter((x) => ['R', 'X', 'P', 'F', 'AC', 'DF'].includes(prefixOf(x.code)))) {
      const key = `${s.id}/${d.code}`;
      const dn = [...(g.down.get(key) || [])];
      const by = (...ts) => dn.filter((k) => ts.some((t) => k.startsWith(`${t}-`))).map((k) => k.replace(`${s.id}/`, ''));
      const cols = [];
      const local = dn.filter((k) => k.startsWith(`${s.id}/AC-`)).map((k) => k.split('/')[1]);
      if (!d.code.startsWith('AC-') && !d.code.startsWith('DF-')) cols.push(`AC: ${local.join(',') || '—'}`);
      if (['R', 'DF'].includes(prefixOf(d.code))) cols.push(`realized: ${by('DSN', 'PLAN').filter((k) => /\/(RZ|DM)-/.test(k)).join(',') || '—'}`);
      if (d.code.startsWith('AC-')) {
        cols.push(`tasks: ${by('PLAN').filter((k) => /\/TK-/.test(k)).join(',') || '—'}`);
        const t = tests.filter((h) => h.key === key);
        cols.push(`tests: ${t.length ? t.map((h) => `${h.file}:${h.line}`).join(', ') : '—'}`);
      }
      console.log(`  ${d.code.padEnd(6)} ${cols.join('   ')}`);
    }
  }
}

const HELP = `skyline ${VERSION} — Skyline spec checker

  skyline init [--root specs] [--project name] [--owner name]
  skyline new <SRC|BRIEF|SPEC|DSN|PLAN> "<title>" [--parent ID,..] [--supersedes ID]
              SPEC: --flow feature|project|adopt (default: project with a BRIEF parent, else feature); SPEC/DSN: --risk normal|high
              SRC:  --file <path> | --stdin, --from <who>, --kind <document|email|meeting|ticket|owner-answers|spike-findings>
  skyline index                      list artifacts and pending revisions
  skyline show <ID|ID/CODE|CODE>     an artifact, an item and where it is mentioned
  skyline trace <ID|ID/CODE>         upstream sources and downstream dependants
  skyline impact <ID|ID/CODE>        what depends on it (before changing it)
  skyline coverage [SPEC-n]          rules → AC → realization → tasks → tests
  skyline check [ID] [--tests] [--results junit.xml|jest.json] [--strict] [--branches] [--json] [--quiet]
              --tests: every AC named in a test title · --results: and those tests passed
              --strict: pre-merge; drift, pending revisions and plans on unapproved specs become errors
  skyline revise <ID> --level patch|minor|major --reason "<why>"   draft the next version of an approved artifact
  skyline review-stamp <ID> [--report path] [--note "<why>"]   bind a review report to this exact content
  skyline diff <ID>                  pending revision vs approved version
  skyline discard <ID>               drop a pending revision
  skyline repin <ID> [--pending]     re-pin a draft (or a revision) to its parents' current versions;
                                     --pending: to their pending revisions, checked together as one revision set
  skyline renumber <ID|file> [--to N]   give a draft a free id and rewrite references

  owner only, in your own terminal (refused inside an agent session):
  skyline approve <ID> [<ID> ...] --by <name> [--with-sources] [--skip-review "<reason>"] [--date YYYY-MM-DD]
                                     several ids: a revision set, approved parents first
  skyline upgrade                    refresh the vendored .skyline/skyline.mjs
`;

export async function main(argv) {
  const [cmd, ...rest] = argv;
  const { pos, flags } = parseArgs(rest);
  try {
    switch (cmd) {
      case 'init': return cmdInit(flags);
      case 'new': return await cmdNew(pos, flags);
      case 'index': case 'ls': return cmdIndex();
      case 'show': case 'find': return cmdShow(pos);
      case 'trace': return cmdTrace(pos, flags, ['up', 'down']);
      case 'impact': return cmdTrace(pos, flags, ['down']);
      case 'coverage': return cmdCoverage(pos);
      case 'check': return cmdCheck(pos, flags);
      case 'revise': return cmdRevise(pos, flags);
      case 'review-stamp': return cmdReviewStamp(pos, flags);
      case 'diff': return cmdDiff(pos);
      case 'discard': return cmdDiscard(pos);
      case 'repin': return cmdRepin(pos, flags);
      case 'renumber': return cmdRenumber(pos, flags);
      case 'approve': return cmdApprove(pos, flags);
      case 'upgrade': return cmdUpgrade();
      case 'reopen': throw new CliError('reopen was replaced by revisions: skyline revise <ID> --level patch|minor|major --reason "<why>", then the owner approves');
      case 'version': case '--version': return console.log(VERSION);
      default:
        console.log(HELP);
        process.exitCode = cmd && cmd !== 'help' && cmd !== '--help' ? 2 : 0;
    }
  } catch (e) {
    if (e instanceof CliError) {
      console.error(`skyline: ${e.message}`);
      process.exitCode = e.exit;
      return;
    }
    throw e;
  }
}

const invokedDirectly = (() => {
  try {
    return Boolean(process.argv[1]) && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
})();
if (invokedDirectly) main(process.argv.slice(2));
