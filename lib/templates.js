'use strict';
/**
 * Bundled contract template pack — 16 plain-language starting points.
 * Every template is clearly marked NOT LEGAL ADVICE; users should have
 * counsel review anything important. Variables use {{snake_case}} and are
 * discovered by lib/merge.js at runtime, so users can add their own.
 */

const DISCLAIMER =
  '<p class="disclaimer"><em>This template is a general-purpose starting point, not legal advice. ' +
  'Laws differ by state and country — have a qualified attorney review before relying on it.</em></p>';

function sig2(aLabel, bLabel) {
  return `
<table class="sig-table"><tr>
<td><p>____________________________<br>${aLabel}: {{party_a_signer}}<br>Date: {{signing_date}}</p></td>
<td><p>____________________________<br>${bLabel}: {{party_b_signer}}<br>Date: {{signing_date}}</p></td>
</tr></table>`;
}

const TEMPLATES = [
  {
    id: 'nda-mutual',
    name: 'Mutual NDA',
    category: 'NDA',
    description: 'Both sides share confidential info (partnership talks, due diligence).',
    body_html: `
<h1>Mutual Non-Disclosure Agreement</h1>
${DISCLAIMER}
<p>This Mutual Non-Disclosure Agreement ("Agreement") is made on <strong>{{effective_date}}</strong> between <strong>{{party_a_name}}</strong> ("Party A") and <strong>{{party_b_name}}</strong> ("Party B"), together the "Parties".</p>
<h2>1. Purpose</h2>
<p>The Parties wish to explore <strong>{{purpose}}</strong> (the "Purpose") and may each disclose confidential information to the other for that Purpose.</p>
<h2>2. Confidential Information</h2>
<p>"Confidential Information" means any non-public information disclosed by either Party, whether written, oral, or electronic, that is marked confidential or that a reasonable person would treat as confidential — including business plans, financials, customer lists, technology, and product roadmaps.</p>
<h2>3. Exclusions</h2>
<p>Confidential Information does not include information that: (a) is or becomes public through no fault of the receiving Party; (b) was lawfully known to the receiving Party before disclosure; (c) is independently developed without use of the other Party's information; or (d) is lawfully received from a third party without restriction.</p>
<h2>4. Obligations</h2>
<p>Each Party agrees to: (a) use the other's Confidential Information only for the Purpose; (b) protect it with at least the care used for its own confidential information, and no less than reasonable care; and (c) not disclose it to anyone except employees and advisors who need it for the Purpose and are bound by comparable confidentiality obligations.</p>
<h2>5. Term</h2>
<p>This Agreement applies to disclosures made within <strong>{{term_years}}</strong> year(s) of the effective date. Confidentiality obligations survive for <strong>{{survival_years}}</strong> year(s) after disclosure.</p>
<h2>6. Return of Materials</h2>
<p>On written request, each Party will return or destroy the other's Confidential Information, except one archival copy kept solely to monitor compliance.</p>
<h2>7. No License; No Obligation</h2>
<p>No license or other rights are granted by disclosure. Neither Party is obligated to proceed with any transaction.</p>
<h2>8. Governing Law</h2>
<p>This Agreement is governed by the laws of <strong>{{governing_state}}</strong>.</p>
${sig2('Party A', 'Party B')}`
  },
  {
    id: 'nda-oneway',
    name: 'One-Way NDA',
    category: 'NDA',
    description: 'You disclose; they keep it secret (pitching, hiring contractors).',
    body_html: `
<h1>One-Way Non-Disclosure Agreement</h1>
${DISCLAIMER}
<p>This Non-Disclosure Agreement ("Agreement") is made on <strong>{{effective_date}}</strong> between <strong>{{disclosing_party}}</strong> (the "Disclosing Party") and <strong>{{receiving_party}}</strong> (the "Receiving Party").</p>
<h2>1. Purpose</h2>
<p>The Disclosing Party will share confidential information relating to <strong>{{purpose}}</strong> so the Receiving Party can <strong>{{receiving_use}}</strong>.</p>
<h2>2. Confidential Information</h2>
<p>"Confidential Information" means all non-public information disclosed by the Disclosing Party, in any form, that is marked confidential or that a reasonable person would treat as confidential.</p>
<h2>3. Receiving Party Obligations</h2>
<p>The Receiving Party will: (a) use the Confidential Information only for the stated Purpose; (b) not disclose it to any third party without prior written consent; (c) protect it with reasonable care; and (d) promptly notify the Disclosing Party of any unauthorized use or disclosure.</p>
<h2>4. Exclusions</h2>
<p>Standard exclusions apply: information already public, already known, independently developed, or lawfully obtained from a third party.</p>
<h2>5. Term & Survival</h2>
<p>Obligations begin on the effective date and survive for <strong>{{survival_years}}</strong> year(s) after each disclosure.</p>
<h2>6. Return & Remedies</h2>
<p>On request, the Receiving Party will return or destroy all Confidential Information. The Parties agree that breach may cause irreparable harm, entitling the Disclosing Party to seek injunctive relief in addition to other remedies.</p>
<h2>7. Governing Law</h2>
<p>This Agreement is governed by the laws of <strong>{{governing_state}}</strong>.</p>
${sig2('Disclosing Party', 'Receiving Party')}`
  },
  {
    id: 'freelance',
    name: 'Freelance / Independent Contractor Agreement',
    category: 'Freelance & Consulting',
    description: 'The classic contractor agreement: scope, pay, IP, independence.',
    body_html: `
<h1>Independent Contractor Agreement</h1>
${DISCLAIMER}
<p>This Agreement is made on <strong>{{effective_date}}</strong> between <strong>{{client_name}}</strong> ("Client") and <strong>{{contractor_name}}</strong> ("Contractor").</p>
<h2>1. Services</h2>
<p>Contractor will perform the following services: <strong>{{services_description}}</strong> (the "Services"), starting <strong>{{start_date}}</strong> and targeting completion by <strong>{{end_date}}</strong>.</p>
<h2>2. Compensation</h2>
<p>Client will pay Contractor <strong>{{fee}}</strong>, invoiced <strong>{{invoice_schedule}}</strong>. Invoices are due net <strong>{{payment_days}}</strong> days. Late amounts accrue interest at 1.5% per month or the maximum allowed by law, whichever is lower.</p>
<h2>3. Expenses</h2>
<p>Pre-approved, documented expenses are reimbursed at cost. All other costs are Contractor's responsibility.</p>
<h2>4. Independent Contractor Status</h2>
<p>Contractor is an independent contractor, not an employee. Contractor controls the manner and means of performing the Services, provides their own tools, and is responsible for their own taxes, insurance, and benefits.</p>
<h2>5. Intellectual Property</h2>
<p>Upon full payment, deliverables created specifically for Client under this Agreement are assigned to Client. Contractor retains ownership of pre-existing materials and general-purpose tools, and grants Client a perpetual, non-exclusive license to use them as embedded in the deliverables.</p>
<h2>6. Confidentiality</h2>
<p>Each party will keep the other's non-public information confidential and use it only as needed to perform this Agreement.</p>
<h2>7. Revisions & Change Requests</h2>
<p>The fee includes <strong>{{revision_rounds}}</strong> round(s) of revisions. Additional work is quoted separately at <strong>{{hourly_rate}}</strong>/hour.</p>
<h2>8. Termination</h2>
<p>Either party may terminate with <strong>{{notice_days}}</strong> days' written notice. Client pays for all work performed through the termination date.</p>
<h2>9. Limitation of Liability</h2>
<p>Neither party is liable for indirect or consequential damages. Contractor's total liability is capped at fees actually paid under this Agreement.</p>
<h2>10. Governing Law</h2>
<p>This Agreement is governed by the laws of <strong>{{governing_state}}</strong>.</p>
${sig2('Client', 'Contractor')}`
  },
  {
    id: 'consulting',
    name: 'Consulting Agreement',
    category: 'Freelance & Consulting',
    description: 'Advisory engagements: findings, recommendations, no employment.',
    body_html: `
<h1>Consulting Agreement</h1>
${DISCLAIMER}
<p>This Consulting Agreement is made on <strong>{{effective_date}}</strong> between <strong>{{client_name}}</strong> ("Client") and <strong>{{consultant_name}}</strong> ("Consultant").</p>
<h2>1. Engagement</h2>
<p>Client engages Consultant to provide advice and deliverables regarding <strong>{{engagement_scope}}</strong>. Specific deliverables: <strong>{{deliverables}}</strong>.</p>
<h2>2. Fees</h2>
<p>Client will pay <strong>{{fee_structure}}</strong>. Invoices are due net <strong>{{payment_days}}</strong> days.</p>
<h2>3. Client Responsibilities</h2>
<p>Client will provide timely access to the personnel, systems, and information reasonably needed. Delays caused by Client may shift the timeline.</p>
<h2>4. No Guarantee of Outcome</h2>
<p>Consultant will perform with professional skill and care. Recommendations are advisory; business decisions and results remain Client's responsibility.</p>
<h2>5. Intellectual Property</h2>
<p>Reports and deliverables prepared for Client are Client's on full payment. Consultant's methodologies, frameworks, and know-how remain Consultant's, licensed to Client for internal use.</p>
<h2>6. Confidentiality & Non-Solicitation</h2>
<p>Each party keeps the other's non-public information confidential. During the engagement and for <strong>{{nonsolicit_months}}</strong> months after, neither party will solicit the other's employees involved in the engagement.</p>
<h2>7. Term & Termination</h2>
<p>The engagement runs from <strong>{{start_date}}</strong> until completed or terminated by either party on <strong>{{notice_days}}</strong> days' written notice. Fees for work performed are due through termination.</p>
<h2>8. Governing Law</h2>
<p>This Agreement is governed by the laws of <strong>{{governing_state}}</strong>.</p>
${sig2('Client', 'Consultant')}`
  },
  {
    id: 'services',
    name: 'General Service Agreement',
    category: 'Services',
    description: 'Catch-all recurring or one-off services agreement.',
    body_html: `
<h1>Service Agreement</h1>
${DISCLAIMER}
<p>This Service Agreement is made on <strong>{{effective_date}}</strong> between <strong>{{provider_name}}</strong> ("Provider") and <strong>{{client_name}}</strong> ("Client").</p>
<h2>1. Services</h2>
<p>Provider will supply: <strong>{{services_description}}</strong>, at the service level and frequency of <strong>{{service_frequency}}</strong>.</p>
<h2>2. Price & Payment</h2>
<p>Client pays <strong>{{price}}</strong>, payable <strong>{{payment_terms}}</strong>. Amounts unpaid <strong>{{late_days}}</strong> days after the due date may result in suspension of Services after written notice.</p>
<h2>3. Term</h2>
<p>This Agreement begins on <strong>{{start_date}}</strong> and continues <strong>{{term_description}}</strong>, unless terminated under Section 6.</p>
<h2>4. Standards</h2>
<p>Provider will perform the Services in a professional, workmanlike manner consistent with industry standards, and will comply with applicable laws.</p>
<h2>5. Client Obligations</h2>
<p>Client will provide safe access, accurate information, and any cooperation reasonably required: <strong>{{client_obligations}}</strong>.</p>
<h2>6. Termination</h2>
<p>Either party may terminate: (a) for convenience with <strong>{{notice_days}}</strong> days' written notice; or (b) immediately for material breach not cured within 10 days of written notice.</p>
<h2>7. Liability</h2>
<p>Provider's total liability is capped at the fees paid in the 3 months before the claim. Neither party is liable for indirect damages.</p>
<h2>8. Governing Law</h2>
<p>This Agreement is governed by the laws of <strong>{{governing_state}}</strong>.</p>
${sig2('Provider', 'Client')}`
  },
  {
    id: 'web-design',
    name: 'Website Design & Development Agreement',
    category: 'Services',
    description: 'Web projects: milestones, revisions, hosting handoff, portfolio rights.',
    body_html: `
<h1>Website Design & Development Agreement</h1>
${DISCLAIMER}
<p>This Agreement is made on <strong>{{effective_date}}</strong> between <strong>{{designer_name}}</strong> ("Developer") and <strong>{{client_name}}</strong> ("Client").</p>
<h2>1. Project</h2>
<p>Developer will design and build a website comprising <strong>{{project_scope}}</strong> (the "Project"). Anything not listed is out of scope and quoted separately.</p>
<h2>2. Fees & Milestones</h2>
<p>Total fee: <strong>{{total_fee}}</strong>. Payable: <strong>{{deposit_pct}}</strong>% deposit to begin, remainder <strong>{{milestone_schedule}}</strong>. Work pauses if any invoice is more than 10 days overdue.</p>
<h2>3. Content & Materials</h2>
<p>Client will deliver text, images, brand assets, and account access by <strong>{{content_deadline}}</strong>. Delays in content delivery shift the timeline day-for-day.</p>
<h2>4. Revisions</h2>
<p>The fee includes <strong>{{revision_rounds}}</strong> revision round(s) per design phase. Further revisions bill at <strong>{{hourly_rate}}</strong>/hour with prior approval.</p>
<h2>5. Launch & Acceptance</h2>
<p>The site is deemed accepted when Client approves in writing or uses it in production, or 10 business days after delivery with no written defect list — whichever comes first.</p>
<h2>6. Ownership & Credit</h2>
<p>On full payment, Client owns the site design and custom code. Open-source components remain under their own licenses. Developer may display the work in portfolios and may place a small footer credit unless Client opts out in writing.</p>
<h2>7. Warranty & Support</h2>
<p>Developer will fix defects reported within <strong>{{warranty_days}}</strong> days of launch at no charge. Ongoing maintenance is available separately.</p>
<h2>8. Governing Law</h2>
<p>This Agreement is governed by the laws of <strong>{{governing_state}}</strong>.</p>
${sig2('Developer', 'Client')}`
  },
  {
    id: 'social-media',
    name: 'Social Media Management Agreement',
    category: 'Services',
    description: 'Monthly content + community management retainer.',
    body_html: `
<h1>Social Media Management Agreement</h1>
${DISCLAIMER}
<p>This Agreement is made on <strong>{{effective_date}}</strong> between <strong>{{agency_name}}</strong> ("Manager") and <strong>{{client_name}}</strong> ("Client").</p>
<h2>1. Services</h2>
<p>Manager will manage the following channels: <strong>{{channels}}</strong>, delivering <strong>{{deliverables_per_month}}</strong> per month, including scheduling, community responses within 1 business day, and a monthly performance report.</p>
<h2>2. Fee</h2>
<p>Client pays <strong>{{monthly_fee}}</strong> per month, in advance, on the <strong>{{billing_day}}</strong> of each month. Paid ad spend is billed directly to Client's ad accounts.</p>
<h2>3. Approvals</h2>
<p>Content calendars are delivered <strong>{{approval_lead_days}}</strong> days before publication. Items not rejected in writing within 3 business days are deemed approved.</p>
<h2>4. Account Access & Ownership</h2>
<p>All social accounts, followers, and content belong to Client. Manager receives limited access and returns/rotates credentials on termination.</p>
<h2>5. Results</h2>
<p>Manager will apply professional best practices but does not guarantee follower counts, reach, or revenue outcomes.</p>
<h2>6. Term & Termination</h2>
<p>Month-to-month from <strong>{{start_date}}</strong>; either party may terminate with <strong>{{notice_days}}</strong> days' written notice. Prepaid fees for undelivered months are refunded pro-rata.</p>
<h2>7. Governing Law</h2>
<p>This Agreement is governed by the laws of <strong>{{governing_state}}</strong>.</p>
${sig2('Manager', 'Client')}`
  },
  {
    id: 'retainer',
    name: 'Retainer Agreement',
    category: 'Freelance & Consulting',
    description: 'Reserved monthly hours at a fixed fee, with rollover rules.',
    body_html: `
<h1>Retainer Agreement</h1>
${DISCLAIMER}
<p>This Retainer Agreement is made on <strong>{{effective_date}}</strong> between <strong>{{provider_name}}</strong> ("Provider") and <strong>{{client_name}}</strong> ("Client").</p>
<h2>1. Retained Services</h2>
<p>Provider reserves <strong>{{monthly_hours}}</strong> hours per month for <strong>{{services_description}}</strong>.</p>
<h2>2. Retainer Fee</h2>
<p>Client pays <strong>{{monthly_fee}}</strong> per month in advance on the <strong>{{billing_day}}</strong>. Hours beyond the retainer bill at <strong>{{overage_rate}}</strong>/hour with prior notice.</p>
<h2>3. Unused Hours</h2>
<p>Up to <strong>{{rollover_hours}}</strong> unused hours roll into the following month; the rest expire. Rolled hours expire if unused that month.</p>
<h2>4. Priority & Turnaround</h2>
<p>Retainer clients receive priority scheduling; standard turnaround target is <strong>{{turnaround}}</strong> for routine requests.</p>
<h2>5. Term & Termination</h2>
<p>Month-to-month from <strong>{{start_date}}</strong>. Either party may terminate with <strong>{{notice_days}}</strong> days' written notice before the next billing date.</p>
<h2>6. Governing Law</h2>
<p>This Agreement is governed by the laws of <strong>{{governing_state}}</strong>.</p>
${sig2('Provider', 'Client')}`
  },
  {
    id: 'sow',
    name: 'Statement of Work (SOW)',
    category: 'Freelance & Consulting',
    description: 'Attach to a master agreement: scope, milestones, acceptance.',
    body_html: `
<h1>Statement of Work #{{sow_number}}</h1>
${DISCLAIMER}
<p>This Statement of Work ("SOW") is entered on <strong>{{effective_date}}</strong> under the master agreement dated <strong>{{msa_date}}</strong> between <strong>{{client_name}}</strong> and <strong>{{provider_name}}</strong>. If this SOW conflicts with the master agreement, this SOW controls for this Project only.</p>
<h2>1. Project Summary</h2>
<p><strong>{{project_summary}}</strong></p>
<h2>2. Deliverables</h2>
<p><strong>{{deliverables}}</strong></p>
<h2>3. Schedule & Milestones</h2>
<p><strong>{{milestones}}</strong></p>
<h2>4. Fees</h2>
<p><strong>{{fees}}</strong>, invoiced <strong>{{invoice_schedule}}</strong>, due net <strong>{{payment_days}}</strong> days.</p>
<h2>5. Assumptions</h2>
<p><strong>{{assumptions}}</strong></p>
<h2>6. Acceptance</h2>
<p>Client has <strong>{{acceptance_days}}</strong> business days to review each deliverable and provide a written defect list; otherwise the deliverable is accepted. Provider will promptly correct reported defects.</p>
<h2>7. Change Control</h2>
<p>Scope changes require a written change order signed by both parties stating the impact on fees and schedule.</p>
${sig2('Client', 'Provider')}`
  },
  {
    id: 'photography',
    name: 'Photography / Videography Agreement',
    category: 'Services',
    description: 'Shoots: date, deliverables, usage rights, cancellations.',
    body_html: `
<h1>Photography / Videography Services Agreement</h1>
${DISCLAIMER}
<p>This Agreement is made on <strong>{{effective_date}}</strong> between <strong>{{photographer_name}}</strong> ("Creator") and <strong>{{client_name}}</strong> ("Client").</p>
<h2>1. Shoot</h2>
<p>Creator will provide services for <strong>{{event_description}}</strong> on <strong>{{shoot_date}}</strong> at <strong>{{location}}</strong>, for approximately <strong>{{coverage_hours}}</strong> hours.</p>
<h2>2. Deliverables</h2>
<p><strong>{{deliverables}}</strong>, delivered within <strong>{{delivery_days}}</strong> days via <strong>{{delivery_method}}</strong>.</p>
<h2>3. Fees & Booking</h2>
<p>Total fee: <strong>{{total_fee}}</strong>. A non-refundable booking deposit of <strong>{{deposit}}</strong> reserves the date; the balance is due <strong>{{balance_due}}</strong>.</p>
<h2>4. Usage Rights</h2>
<p>Client receives a <strong>{{license_type}}</strong> license for the deliverables. Creator retains copyright and may use the work for portfolio and marketing unless Client opts out in writing.</p>
<h2>5. Rescheduling & Cancellation</h2>
<p>Client may reschedule once with <strong>{{reschedule_notice_days}}</strong> days' notice, subject to availability. Cancellations forfeit the deposit; cancellations within <strong>{{late_cancel_days}}</strong> days of the shoot owe 50% of the total fee.</p>
<h2>6. Weather & Failure</h2>
<p>For weather or venue failures beyond either party's control, the parties will reschedule without penalty. If Creator cannot perform and cannot supply a comparable substitute, all payments are refunded — this refund is Client's sole remedy.</p>
<h2>7. Governing Law</h2>
<p>This Agreement is governed by the laws of <strong>{{governing_state}}</strong>.</p>
${sig2('Creator', 'Client')}`
  },
  {
    id: 'sales',
    name: 'Simple Sales Agreement (Goods)',
    category: 'Sales & Rentals',
    description: 'One-off sale of physical goods between two parties.',
    body_html: `
<h1>Sales Agreement</h1>
${DISCLAIMER}
<p>This Sales Agreement is made on <strong>{{effective_date}}</strong> between <strong>{{seller_name}}</strong> ("Seller") and <strong>{{buyer_name}}</strong> ("Buyer").</p>
<h2>1. Goods</h2>
<p>Seller sells and Buyer purchases: <strong>{{goods_description}}</strong> (the "Goods"), condition: <strong>{{condition}}</strong>.</p>
<h2>2. Price & Payment</h2>
<p>Purchase price: <strong>{{price}}</strong>, payable by <strong>{{payment_method}}</strong> on or before <strong>{{payment_date}}</strong>.</p>
<h2>3. Delivery & Title</h2>
<p>Delivery: <strong>{{delivery_terms}}</strong>. Title and risk of loss pass to Buyer on <strong>{{title_transfer}}</strong>.</p>
<h2>4. Inspection</h2>
<p>Buyer may inspect on delivery and must report non-conformities in writing within <strong>{{inspection_days}}</strong> days; otherwise the Goods are accepted.</p>
<h2>5. Warranty</h2>
<p><strong>{{warranty_terms}}</strong>. EXCEPT AS STATED, THE GOODS ARE SOLD "AS IS" AND SELLER DISCLAIMS ALL IMPLIED WARRANTIES TO THE EXTENT PERMITTED BY LAW.</p>
<h2>6. Governing Law</h2>
<p>This Agreement is governed by the laws of <strong>{{governing_state}}</strong>.</p>
${sig2('Seller', 'Buyer')}`
  },
  {
    id: 'equipment-rental',
    name: 'Equipment Rental Agreement',
    category: 'Sales & Rentals',
    description: 'Rent out gear: deposit, damage, late returns.',
    body_html: `
<h1>Equipment Rental Agreement</h1>
${DISCLAIMER}
<p>This Rental Agreement is made on <strong>{{effective_date}}</strong> between <strong>{{owner_name}}</strong> ("Owner") and <strong>{{renter_name}}</strong> ("Renter").</p>
<h2>1. Equipment</h2>
<p>Owner rents to Renter: <strong>{{equipment_description}}</strong> (the "Equipment"), replacement value <strong>{{replacement_value}}</strong>.</p>
<h2>2. Rental Period & Rate</h2>
<p>From <strong>{{start_date}}</strong> to <strong>{{end_date}}</strong> at <strong>{{rate}}</strong>. Late returns accrue <strong>{{late_fee}}</strong> per day.</p>
<h2>3. Deposit</h2>
<p>A refundable security deposit of <strong>{{deposit}}</strong> is due at pickup, returned within <strong>{{deposit_return_days}}</strong> days of return less any amounts owed for damage, cleaning, or late fees (itemized in writing).</p>
<h2>4. Care & Use</h2>
<p>Renter will use the Equipment carefully and only for its intended purpose, will not sublease or modify it, and is responsible for loss, theft, and damage beyond normal wear during the rental period, up to the replacement value.</p>
<h2>5. Condition Record</h2>
<p>Condition at pickup: <strong>{{condition_notes}}</strong>. Both parties should photograph the Equipment at pickup and return.</p>
<h2>6. Governing Law</h2>
<p>This Agreement is governed by the laws of <strong>{{governing_state}}</strong>.</p>
${sig2('Owner', 'Renter')}`
  },
  {
    id: 'lease-addendum',
    name: 'Residential Lease Addendum',
    category: 'Real Estate',
    description: 'Modify one term of an existing lease without rewriting it.',
    body_html: `
<h1>Residential Lease Addendum</h1>
${DISCLAIMER}
<p>This Addendum, dated <strong>{{effective_date}}</strong>, modifies the lease dated <strong>{{lease_date}}</strong> for the property at <strong>{{property_address}}</strong> between <strong>{{landlord_name}}</strong> ("Landlord") and <strong>{{tenant_name}}</strong> ("Tenant").</p>
<h2>1. Amendment</h2>
<p>The lease is amended as follows: <strong>{{amendment_text}}</strong></p>
<h2>2. Effective Date of Change</h2>
<p>The amendment takes effect on <strong>{{amendment_start_date}}</strong>.</p>
<h2>3. All Other Terms Unchanged</h2>
<p>Except as amended above, all terms of the original lease remain in full force. If this Addendum conflicts with the lease, this Addendum controls.</p>
<h2>4. Governing Law</h2>
<p>Governed by the laws of <strong>{{governing_state}}</strong>. Local rental regulations may impose additional requirements — check before signing.</p>
${sig2('Landlord', 'Tenant')}`
  },
  {
    id: 'media-release',
    name: 'Testimonial & Media Release',
    category: 'Misc',
    description: 'Permission to use someone\'s name, likeness, or testimonial.',
    body_html: `
<h1>Testimonial & Media Release</h1>
${DISCLAIMER}
<p>I, <strong>{{releasor_name}}</strong>, grant <strong>{{company_name}}</strong> ("Company") permission to use the following (the "Materials"): <strong>{{materials_description}}</strong>.</p>
<h2>1. Grant</h2>
<p>I grant Company a perpetual, worldwide, royalty-free license to use, reproduce, edit, and publish the Materials — including my name, image, voice, and words — in Company's marketing across <strong>{{usage_channels}}</strong>.</p>
<h2>2. No Compensation</h2>
<p>I receive <strong>{{compensation}}</strong> as full consideration and expect no further payment or approval rights over reasonable edits that preserve meaning.</p>
<h2>3. Accuracy</h2>
<p>Any testimonial reflects my genuine opinion and experience. Company will not materially alter the meaning of my statements.</p>
<h2>4. Revocation</h2>
<p>I may revoke this release for future uses with 30 days' written notice; already-published materials and printed matter in circulation are unaffected.</p>
<p>Signed: ____________________________ ({{releasor_name}})<br>Date: {{signing_date}}</p>`
  },
  {
    id: 'termination-letter',
    name: 'Contract Termination Letter',
    category: 'Misc',
    description: 'Formally end an existing agreement, cleanly.',
    body_html: `
<h1>Notice of Contract Termination</h1>
${DISCLAIMER}
<p>Date: <strong>{{letter_date}}</strong></p>
<p>From: <strong>{{sender_name}}</strong><br>To: <strong>{{recipient_name}}</strong></p>
<p>Re: Termination of the agreement titled "<strong>{{contract_title}}</strong>" dated <strong>{{contract_date}}</strong> (the "Agreement").</p>
<p>This letter provides formal notice that <strong>{{sender_name}}</strong> is terminating the Agreement effective <strong>{{termination_date}}</strong>, pursuant to <strong>{{termination_clause}}</strong> of the Agreement.</p>
<h2>Wind-down</h2>
<p>By the effective date: (a) each party will settle outstanding invoices for work performed; (b) each party will return or destroy the other's confidential materials and property; and (c) the following handover will occur: <strong>{{handover_items}}</strong>.</p>
<h2>Surviving Terms</h2>
<p>Provisions that by their nature survive termination (confidentiality, payment for work performed, liability limits) remain in effect.</p>
<p>We appreciate the working relationship and wish you well going forward.</p>
<p>Sincerely,<br><br>____________________________<br>{{sender_name}}, {{sender_title}}</p>`
  },
  {
    id: 'payment-plan',
    name: 'Payment Plan Agreement',
    category: 'Misc',
    description: 'Debt or invoice paid in installments, with default terms.',
    body_html: `
<h1>Payment Plan Agreement</h1>
${DISCLAIMER}
<p>This Payment Plan Agreement is made on <strong>{{effective_date}}</strong> between <strong>{{creditor_name}}</strong> ("Creditor") and <strong>{{debtor_name}}</strong> ("Debtor").</p>
<h2>1. Acknowledged Balance</h2>
<p>Debtor acknowledges owing Creditor <strong>{{total_amount}}</strong> for <strong>{{debt_description}}</strong>.</p>
<h2>2. Installments</h2>
<p>Debtor will pay <strong>{{installment_amount}}</strong> every <strong>{{installment_frequency}}</strong>, starting <strong>{{first_payment_date}}</strong>, until the balance is paid in full, via <strong>{{payment_method}}</strong>.</p>
<h2>3. No Additional Interest</h2>
<p>Provided payments stay current, no further interest or fees accrue on the balance. <strong>{{discount_terms}}</strong></p>
<h2>4. Default</h2>
<p>A payment more than <strong>{{grace_days}}</strong> days late is a default. On default and 10 days' written notice without cure, the full remaining balance becomes immediately due.</p>
<h2>5. Governing Law</h2>
<p>This Agreement is governed by the laws of <strong>{{governing_state}}</strong>.</p>
${sig2('Creditor', 'Debtor')}`
  }
];

module.exports = { TEMPLATES, DISCLAIMER };
