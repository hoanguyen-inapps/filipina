---
id: SRC-1
title: Developer Project Brief rev 8-31-26
version: 1.0.0
status: approved
owner: Honda
kind: document
received: 2026-09-29
from: FilipinaConnect.US (client, Kurt & Cristina Wilson); PDF 'FilipinaConnect_US_Developer_Project_Brief rev 8-31-26.pdf', text extracted with pypdf
supersedes:
approved_by: Honda
approved_at: 2026-09-29
approved_hash: sha256:6f508467df35db010dc61fa9
---
CONFIDENTIAL — FILIPINACONNECT.US

                                     FILIPINACONNECT.US
                                 Mobile App + Web Platform Development Project Brief

                                           Connecting Hearts, Creating Futures
                                          Trusted Relationship Discovery Platform
                                        Developer Proposal Request - August 2026

 PROJECT OVERVIEW

 FilipinaConnect.US is a U.S.-Philippines relationship discovery platform designed to connect verified adult men in the
 United States with verified adult women in the Philippines. The platform is built around verified identities, background
 screening, verified profiles, compatibility and profile discovery, cultural education, controlled contact requests, mutual
 consent before communication, in-app messaging, and trust and safety.

 We are specifically seeking a small, hands-on Philippine development team or boutique development studio rather
 than a large outsourcing corporation. We want the founders/senior developers to be directly involved in the project.

 PROPOSED TECHNOLOGY / BACKEND ARCHITECTURE

 Our current proposal is to use SmartMatchApp as the primary matchmaking/platform API backend, rather than
 building the entire matchmaking backend from scratch.

  Evaluate SmartMatchApp's available API capabilities.

  Determine exactly which FilipinaConnect.US functions can be handled by SmartMatchApp.

  Integrate the mobile applications and website with SmartMatchApp.

  Identify any functionality that must be developed separately.

  Recommend architecture for accounts, profiles, search/browsing, matching, likes, contact requests, messaging,
 memberships, verification status, administration, notifications, reporting/blocking, and audit logs.

  Clearly identify limitations or custom development required around SmartMatchApp.

 We are not asking the developer to assume SmartMatchApp can perform functions it does not support. We want the
 developer to investigate the API and recommend the best architecture.
 PLATFORM COMPONENTSCONFIDENTIAL


 A. Mobile Application - iOS and Android, preferably using a shared-codebase approach such as Flutter or another
 appropriate technology.

 B. Website - Public-facing website supporting account management and membership purchasing. Membership payments
 are intended to occur through the website rather than Apple/Google in-app purchases, subject to final technical, legal, and
 platform-policy review.

 C. Administrative Dashboard - User/profile management, verification status, memberships, contact requests, reports,
 blocks, moderation, fraud/safety flags, subscriptions, content, cultural education, audit logs, and system notifications.

 CURRENT USER JOURNEY

 The following is the current approved user journey and should be treated as the baseline product workflow.





FilipinaConnect.US - Developer Project Brief                                                                                       Page 1
CONFIDENTIAL — FILIPINACONNECT.US

 U.S. MAN USER JOURNEY

 1. Welcome Screen
 2. Our Story Screen

 3. Our Advice Screen
 4. I Am A Man Screen

 5. Register Account - name, email, location, date of birth
 6. Email Confirmation Request

 7. Email Confirmed
 8. Identity Verification - selfie + government-issued ID

 9. Enter the Freemium Lobby - limited number of Philippine women's profiles; send and receive likes
 10. Attempt to Purchase Membership Tier - purchase is unavailable at this stage; user is automatically directed to background
    screening
 11. Certn Background Check - applicant completes the application and pays the separate background-check fee; screening
    includes the applicable sex-offender-registry search
 12. Verification Approved - green verification badge/status indicators; underlying Certn reports are not displayed to other users

 13. Tier Purchase Completed
 14. Complete Full User Profile

 15. Cultural Education Screen
 16. Browse Profiles

 17. Request Contact
 18. Philippine User Accepts

 19. In-App Messaging Opens
 PHILIPPINE WOMAN USER JOURNEY

 1. Welcome Screen

 2. Our Story Screen
 3. Our Advice Screen

 4. I Am A Woman ScreenCONFIDENTIAL
 5. Register Account - name, email, location, date of birth

 6. Email Confirmation Request
 7. Email Confirmed

 8. Identity Verification - selfie + government-issued ID + CENOMAR
 9. Verification Approved - green verification badge/status indicators; underlying identity documents and CENOMAR are
    confidential
 10. Complete Full User Profile

 11. Cultural Education Screen
 12. Enter Freemium Lobby

 13. Receive Contact Request
 14. Accept / Decline



FilipinaConnect.US - Developer Project Brief                                                                                                       Page 2
CONFIDENTIAL — FILIPINACONNECT.US

 15. In-App Messaging Opens

 COMMUNICATION MODEL

 Communication must occur inside FilipinaConnect.US. The platform should not automatically provide or exchange
 personal email addresses, telephone numbers, or social-media handles between users. A Philippine user must actively
 accept a contact request before messaging is enabled.

 VERIFICATION MODEL

 The platform should display verification status indicators, not confidential source documents. Potential indicators include:
 Identity Verified; Background Screening Completed; Sex Offender Registry Search Completed; CENOMAR Verified;
 Profile Information Confirmed.

 Other users must never have access to Certn reports, government IDs, selfie/identity-verification documents, CENOMAR
 documents, or other confidential verification records.

 TRUST & SAFETY

  User reporting

  User blocking

  Fraud prevention

  Scam warnings

  Safety education

  Moderation

  Suspicious-account flagging

  Administrative review

  Abuse reporting

  Account suspension/deactivation

  Secure verification handling

 AUDIT LOGGING
 The system should automatically record important events such as account creation, email confirmation, identityCONFIDENTIAL
 verification, verification-status changes, background-check status, subscription events, contact requests, accept/decline
 actions, consent actions, reports, blocks, moderation actions, administrative access, and profile changes. The developer
 should recommend the appropriate secure architecture and retention strategy.

 PAYMENT ARCHITECTURE

 U.S. Man: Create account -> Verify email -> Verify identity -> Freemium Lobby -> Attempt tier purchase -> Required Certn
 background check -> Pay separate Certn fee -> Background verification approved -> Purchase membership tier ->
 Complete full profile.

 Important: Membership subscriptions are intended to be purchased through the FilipinaConnect.US website rather
 than Apple/Google in-app purchasing, subject to applicable platform policies and final legal/technical review. The
 developer should build the mobile application so subscription status can be securely recognized after the website
 transaction.





FilipinaConnect.US - Developer Project Brief                                                                                          Page 3
CONFIDENTIAL — FILIPINACONNECT.US
 REQUIRED DEVELOPER DELIVERABLES - 15 ITEMS

 Please address each of the following items explicitly in your proposal.

 1. MVP Architecture

 Provide the recommended technical architecture for the first production-ready MVP, including mobile technology, web
 technology, backend/API architecture, database, authentication, hosting, third-party services, and admin dashboard.

 2. iOS + Android Strategy
 Explain the recommended framework/shared-codebase strategy, App Store deployment, Google Play deployment, push
 notifications, deep linking, and future scalability.

 3. Web / Admin Dashboard

 Describe the public website and administrative dashboard, including user/profile management, membership management,
 verification management, moderation, reports, blocking, content management, and audit logs.

 4. User Registration / Profile System

 Explain registration, email confirmation, login, password reset, identity verification, user profiles, photos, profile fields,
 visibility, verification badges, and user status.

 5. Matching / Search / Discovery

 Explain how SmartMatchApp can support profile browsing, search, filters, matching, compatibility, likes, Freemium
 limitations, and eligibility rules. Identify which functions are native/API and which require custom development.

 6. Messaging

 Explain secure in-app communication, contact requests, Accept/Decline, messaging only after acceptance, blocking,
 reporting, moderation where appropriate, and push notifications. Explain whether SmartMatchApp can support this
 workflow or whether a separate messaging service is recommended.

 7. Payments / Subscriptions

 Provide the architecture for website membership purchases, recurring subscriptions, membership tiers, subscription
 status, cancellations, refunds, failed payments, chargebacks, payment webhooks, and mobile recognition of subscription
 status.

 8. Identity / Age / Background Verification
 Explain integration with identity verification (selfie + government ID), Certn background screening including applicableCONFIDENTIAL
 sex-offender-registry screening, and Philippine verification (selfie + government ID + CENOMAR). Explain how status
 flows back to FilipinaConnect.US.

 9. IMBRA Compliance TBD

 IMBRA compliance is TBD. We are working with legal counsel regarding applicable legal classification. The developer is
 not expected to provide legal advice, but the technology must support verification, consent, audit logs, safety controls,
 reporting, blocking, status indicators, and secure sensitive-record handling.

 10. Data Security / Privacy Architecture
 Explain encryption, authentication, authorization, secure API communication, sensitive-document handling, PII, payment
 information, verification records, database security, backups, disaster recovery, administrative access, data retention, and
 account deletion.

 11. Audit / Administrative Controls



FilipinaConnect.US - Developer Project Brief                                                                                             Page 4
CONFIDENTIAL — FILIPINACONNECT.US

 Explain controls for reviewing users, verification status, suspending/banning accounts, reports, suspicious activity,
 profiles, membership status, content, and audit events. Administrative activity should itself be logged.

 12. Trust & Safety / Moderation

 Describe reporting, blocking, fraud detection, scam warnings, suspicious behavior controls, content moderation, account
 review, suspension, and appeal/review processes. Identify included versus third-party functions.

 13. App Store / Google Play Deployment

 Include Apple Developer deployment, Google Play deployment, app review preparation, privacy disclosures, required
 permissions, push notification setup, production release, and update process. Explain how website-based membership
 purchasing will be structured while complying with applicable policies.

 14. 12-Month Maintenance / Support

 Provide separate pricing for bug fixes, security/OS updates, store updates, SmartMatchApp API changes, Certn changes,
 payment changes, server/hosting maintenance, and technical support. Specify monthly cost, response times, bug versus
 new-development definitions, and emergency support.

 15. Fixed-Price MVP Estimate + Timeline

 Provide a fixed-price MVP estimate, estimated timeline from kickoff through launch, proposed payment milestones, and
 the actual team assigned: founder/owner, project manager, lead developer, mobile developer, backend/API developer,
 UI/UX designer, and QA/testing. Identify whether the people presented will actually perform the work.

 DEVELOPMENT PHILOSOPHY

 We are specifically looking for a small, hands-on development partner. We are not primarily looking for a large outsourcing
 corporation, a call-center-style development operation, or a project that is handed from salesperson to junior developers.

  Direct communication

  Senior developers involved in the project

  Founder/owner involvement

  Transparent pricing

  Clear milestones

  Startup-friendly approach

  Practical solutionsCONFIDENTIAL

  Clean, maintainable code

  Documentation

  Long-term relationship

 SOURCE CODE / OWNERSHIP

 Please clearly state your policy regarding source-code ownership, GitHub/repository ownership, design files, database
 ownership, API credentials, hosting accounts, Apple Developer accounts, Google Play accounts, third-party service
 accounts, and documentation.

 Our expectation is that FilipinaConnect.US will retain ownership/control of the product, source code, data,
 accounts, and intellectual property developed specifically for the project, subject to the final development
 agreement.






FilipinaConnect.US - Developer Project Brief                                                                                             Page 5
CONFIDENTIAL — FILIPINACONNECT.US
 ITEMS TO DISCUSS

  Company/team introduction

  Relevant previous mobile-app projects

  Links to apps currently available in Apple App Store and/or Google Play

  Relevant matchmaking, dating, social, membership, marketplace, or verification experience

  SmartMatchApp API assessment

  Recommended technology stack

  Recommended architecture

  MVP scope

  Development timeline

  Fixed-price MVP estimate

  Payment milestone schedule

  Third-party costs

  Hosting costs

  App Store/Google Play costs

  Monthly maintenance/support cost

  Team members assigned to the project

  Warranty/bug-fix period

  Source-code/IP ownership terms

  Post-launch support terms

  Any major technical risks or assumptions identified

 IMPORTANT - PLEASE REVIEW THE WORKFLOW

 The user journey in this brief is the current FilipinaConnect.US product workflow. We expect the development team to
 review it carefully and identify missing technical requirements, contradictions, API limitations, security concerns, App
 Store/Google Play issues, payment issues, verification-integration issues, scalability concerns, and anything that shouldCONFIDENTIAL
 be changed before development begins.

 We would much rather have a developer tell us that a part of the workflow will not work as described and
 recommend a better solution than simply agree to everything and discover the problem during development.

 OUR PRIMARY OBJECTIVE

 Build a secure, professional, scalable first version of FilipinaConnect.US that provides a simple and trustworthy
 experience for both sides of the platform.

 Discover -> Register -> Verify -> Participate -> Connect -> Mutual Consent -> Communicate

 FilipinaConnect.US | Connecting Hearts, Creating Futures










FilipinaConnect.US - Developer Project Brief                                                                                        Page 6
