export const modelProfiles = {
  personal: {
    customer: "Founder-led customers and personal trust",
    value: "Speed, conviction, and a distinct point of view",
    activity: "Direct decisions, deals, and hands-on coordination",
    economics: "Often transactional; can be founder-funded",
    boundary: "Mostly owned and tightly controlled",
    fit: "The model moves at the speed of the chief, but the chief remains a single point of coordination.",
    tension: "Growth or recurring services expose the organization's dependence on one person.",
    response: "Give one trusted operator real decision rights and measure whether the enterprise can respond without the founder.",
    whatIf: "What if the founder left next year?",
    selection: { customer: "niche", value: "identity_community", economics: "transaction", boundary: "owned" }
  },
  programmed: {
    customer: "Mass customers with broadly similar needs",
    value: "Reliable output at a low price",
    activity: "Repeatable production or service delivery",
    economics: "Volume, cost leadership, and standardized pricing",
    boundary: "Integrated operations and controlled channels",
    fit: "Stable, repetitive work can be coordinated through rules, standards, and scale.",
    tension: "Efficiency gains can crowd out customization, learning, and innovation.",
    response: "Protect one small adaptive team from output targets and compare its learning with the core operation.",
    whatIf: "What if customers stopped accepting one standardized offer?",
    selection: { customer: "mass", value: "price_reliability", economics: "recurring", boundary: "owned" }
  },
  professional: {
    customer: "Clients seeking judgment, trust, and specialized expertise",
    value: "Proficiency, quality, and professional discretion",
    activity: "Complex problem solving under established standards",
    economics: "Fees, retainers, or recurring professional services",
    boundary: "Professionals connect through external standards and selected partnerships",
    fit: "Trained experts can coordinate through shared standards while retaining operational autonomy.",
    tension: "Performance measures can undermine the professional discretion on which quality depends.",
    response: "Replace one activity metric with an outcome review led jointly by professionals and clients.",
    whatIf: "What if clients paid for outcomes rather than professional time?",
    selection: { customer: "niche", value: "expertise", economics: "recurring", boundary: "mixed" }
  },
  project: {
    customer: "Clients with novel or highly customized needs",
    value: "New solutions created for uncertain problems",
    activity: "Experimentation, problem solving, and mutual adjustment",
    economics: "Projects, milestones, or shared outcome risk",
    boundary: "Teams draw on partners, specialists, and shifting external resources",
    fit: "Complex, dynamic value creation calls for fluid expert teams rather than a fixed command chain.",
    tension: "Project economics can punish the exploration and slack needed for innovation.",
    response: "Run one project with an explicit learning budget and judge it on reusable capability as well as delivery.",
    whatIf: "What if one successful project became the core product?",
    selection: { customer: "niche", value: "novelty", economics: "outcome_sharing", boundary: "open" }
  },
  divisional: {
    customer: "Distinct markets, regions, products, or missions",
    value: "Different offers served under a shared portfolio",
    activity: "Autonomous businesses coordinated through results",
    economics: "Separate profit and loss or performance targets",
    boundary: "Shared headquarters, services, and selected cross-unit functions",
    fit: "Diversified business economics can coexist when units retain autonomy and headquarters focuses on the portfolio.",
    tension: "One central performance system can erase the differences that justified the divisions.",
    response: "Let two divisions negotiate different success measures while sharing one explicit strategic constraint.",
    whatIf: "What if two divisions had to share one customer relationship?",
    selection: { customer: "diversified", value: "access_network", economics: "recurring", boundary: "mixed" }
  },
  community: {
    customer: "Members or participants connected by a shared purpose",
    value: "Belonging, contribution, and a mission people want to advance",
    activity: "Coordination through norms, socialization, and collective action",
    economics: "Membership, contribution, grants, or mission-aligned funding",
    boundary: "Identity and trust determine who belongs and which partners are admitted",
    fit: "Shared beliefs can coordinate committed people with little formal hierarchy.",
    tension: "A strong common identity can become a barrier to dissent, growth, or renewal.",
    response: "Invite an outside group to challenge one founding assumption and publish what the community learns.",
    whatIf: "What if growth required admitting people who do not share the founding belief?",
    selection: { customer: "niche", value: "identity_community", economics: "membership_mission", boundary: "open" }
  },
  political: {
    customer: "Overlapping groups with incompatible promises or priorities",
    value: "Competing claims about what the organization should deliver",
    activity: "Coalitions, bargaining, and contested decisions",
    economics: "Funders, owners, or segments pull resources in different directions",
    boundary: "Authority, expertise, and outside influence are all in play",
    fit: "The arena reveals an unresolved model-form conflict rather than a coherent design.",
    tension: "No stable business model can form while the organization cannot settle who it serves and who decides.",
    response: "Separate the competing promises into two bounded experiments with explicit owners and shared evidence.",
    whatIf: "What if the competing models were separated into different units?",
    selection: { customer: "multi_sided", value: "identity_community", economics: "free_subsidy", boundary: "open" }
  }
};
