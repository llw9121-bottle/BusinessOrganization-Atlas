export const bridgeGroups = {
  customer: {
    options: {
      mass: {
        label: "Mass market",
        insight: "Group around a common offer and standardize the customer path.",
        supports: { programmed: 4 }
      },
      niche: {
        label: "Niche",
        insight: "Protect proximity to specialized needs and the expertise that serves them.",
        supports: { professional: 2, project: 2, community: 1 }
      },
      segmented: {
        label: "Segmented",
        insight: "Differentiate unit offers while sharing selected infrastructure.",
        supports: { divisional: 2, programmed: 1, professional: 1 }
      },
      diversified: {
        label: "Diversified",
        insight: "Give distinct markets enough autonomy to follow different economics.",
        supports: { divisional: 4 },
        strains: ["community"]
      },
      multi_sided: {
        label: "Multi-sided",
        insight: "Coordinate interdependent groups and manage cross-side subsidies explicitly.",
        supports: { divisional: 3, programmed: 2 },
        strains: ["personal"]
      }
    }
  },
  value: {
    options: {
      price_reliability: {
        label: "Price and reliability",
        insight: "Favor repeatable processes, clear standards, and output control.",
        supports: { programmed: 4 },
        strains: ["project"]
      },
      expertise: {
        label: "Expertise",
        insight: "Favor trained autonomy, peer standards, and professional judgment.",
        supports: { professional: 3, project: 2 }
      },
      novelty: {
        label: "Novelty",
        insight: "Favor fluid expert teams and decision rights close to the work.",
        supports: { project: 4 },
        strains: ["programmed"]
      },
      access_network: {
        label: "Access and network",
        insight: "Favor platform coordination, partner governance, and network effects.",
        supports: { programmed: 2, divisional: 2, community: 1 }
      },
      identity_community: {
        label: "Identity and community",
        insight: "Favor shared norms, socialization, and a strong common purpose.",
        supports: { community: 4, project: 1 }
      }
    }
  },
  economics: {
    options: {
      transaction: {
        label: "One-time transaction",
        insight: "Reward customer conversion and unit-level commercial clarity.",
        supports: { personal: 2, divisional: 1 }
      },
      recurring: {
        label: "Recurring service",
        insight: "Requires continuity, service ownership, and repeatable relationship management.",
        supports: { professional: 3, divisional: 2 }
      },
      free_subsidy: {
        label: "Cross-subsidy / FREE",
        insight: "Make subsidy flows visible so one side does not quietly exhaust another.",
        supports: { programmed: 3, community: 2 }
      },
      outcome_sharing: {
        label: "Outcome and risk sharing",
        insight: "Distribute authority and incentives around shared results, not activity volume.",
        supports: { project: 3, professional: 2 }
      },
      membership_mission: {
        label: "Membership / mission",
        insight: "Make mission legitimacy and member voice part of governance.",
        supports: { community: 4 }
      }
    }
  },
  boundary: {
    options: {
      owned: {
        label: "Fully owned",
        insight: "Centralize control but watch for overload and slow adaptation.",
        supports: { personal: 2, programmed: 2 }
      },
      mixed: {
        label: "Mixed",
        insight: "Define where shared infrastructure ends and unit autonomy begins.",
        supports: { professional: 2, divisional: 2 }
      },
      networked: {
        label: "Outsourced / networked",
        insight: "Coordinate across partners without treating every activity as owned.",
        supports: { project: 2, divisional: 1 }
      },
      open: {
        label: "Open ecosystem",
        insight: "Protect governance, identity, and contribution rules while keeping the boundary porous.",
        supports: { project: 3, community: 2 }
      }
    }
  }
};

export const bridgePresets = {
  unbundled: {
    label: "Unbundled businesses",
    selection: { customer: "segmented", value: "expertise", economics: "recurring", boundary: "mixed" },
    primary: "divisional",
    adjacent: "professional",
    fitState: "Needs a bridge",
    summary: "Separate relationship, innovation, and infrastructure businesses enough to protect their different economics without losing useful coordination.",
    tensionId: "unbundled_cultures"
  },
  long_tail: {
    label: "Long Tail",
    selection: { customer: "niche", value: "access_network", economics: "free_subsidy", boundary: "networked" },
    primary: "programmed",
    adjacent: "project",
    fitState: "Hybrid opportunity",
    summary: "A reliable platform core can support many niche producers and expert teams, provided the periphery is not forced to behave like the core.",
    tensionId: "machine_novelty"
  },
  multi_sided: {
    label: "Multi-sided platform",
    selection: { customer: "multi_sided", value: "access_network", economics: "free_subsidy", boundary: "open" },
    primary: "programmed",
    adjacent: "divisional",
    fitState: "Hybrid opportunity",
    summary: "The model needs a stable platform core while several interdependent sides follow different economic needs.",
    tensionId: "multi_governance"
  },
  free: {
    label: "FREE / cross-subsidy",
    selection: { customer: "mass", value: "access_network", economics: "free_subsidy", boundary: "mixed" },
    primary: "programmed",
    adjacent: "community",
    fitState: "Needs a bridge",
    summary: "A paying operating core can support a free edge, but the subsidy logic must remain visible in who gets resources, voice, and protection.",
    tensionId: "subsidy_single"
  },
  open: {
    label: "Open model",
    selection: { customer: "niche", value: "novelty", economics: "outcome_sharing", boundary: "open" },
    primary: "project",
    adjacent: "community",
    fitState: "Needs a bridge",
    summary: "Open value creation depends on fluid expert teams and strong governance of contributions, identity, and shared intellectual property.",
    tensionId: "open_owned"
  }
};

export const bridgeTensionRules = [
  {
    id: "mass_expertise",
    when: { customer: ["mass"], value: ["expertise"] },
    title: "Standardization meets expertise",
    body: "Mass-market scale rewards repeatable rules, while expert value depends on discretion and judgment.",
    response: "Protect a professional or project pocket inside the operating model.",
    whatIf: "What if one expert service became the basis for the entire product?"
  },
  {
    id: "novelty_transaction",
    when: { value: ["novelty"], economics: ["transaction"] },
    title: "Innovation on a short cash cycle",
    body: "Novel work needs repeated exploration, while one-time transactions reward a completed sale.",
    response: "Fund an explicit learning period before judging the commercial result.",
    whatIf: "What if customers paid for a continuing innovation relationship?"
  },
  {
    id: "multi_owned",
    when: { customer: ["multi_sided"], boundary: ["owned"] },
    title: "Platform sides under one owner",
    body: "Interdependent customer groups have different needs, but one owner controls all their resources and rules.",
    response: "Give each side an explicit voice in platform governance.",
    whatIf: "What if one side of the platform could organize independently?"
  },
  {
    id: "multi_governance",
    when: { customer: ["multi_sided"], boundary: ["open"] },
    title: "Governance across an ecosystem",
    body: "The platform creates value through outside participants, yet still needs coherent rules and quality.",
    response: "Separate platform stewardship from the commercial interests of any single side.",
    whatIf: "What if external partners helped set the platform rules?"
  },
  {
    id: "subsidy_single",
    when: { economics: ["free_subsidy"], boundary: ["owned", "mixed"] },
    title: "Hidden cross-subsidy",
    body: "One group pays for another, but a single control system can hide which side is creating or destroying value.",
    response: "Expose the subsidy flow in budgets and decision rights.",
    whatIf: "What if the free side had to cover its own costs?"
  },
  {
    id: "diversified_single",
    when: { customer: ["diversified"], value: ["price_reliability"] },
    title: "One logic for different worlds",
    body: "Diverse markets require different offers, while price-and-reliability logic pushes every unit toward one operating model.",
    response: "Let each division define evidence that is meaningful for its market.",
    whatIf: "What if headquarters only controlled capital allocation?"
  },
  {
    id: "open_owned",
    when: { boundary: ["open"], economics: ["transaction"] },
    title: "Open promise, closed control",
    body: "The model depends on outside participation, but its economic logic still treats value as a closed transaction.",
    response: "Clarify contribution rights, shared upside, and exit rules.",
    whatIf: "What if contributors shared in the value they create?"
  },
  {
    id: "community_transaction",
    when: { value: ["identity_community"], economics: ["transaction"] },
    title: "Community with an extraction problem",
    body: "Shared identity builds commitment, while one-time monetization can make members feel used rather than represented.",
    response: "Test a governance mechanism that gives contributors voice.",
    whatIf: "What if members helped decide how value is captured?"
  },
  {
    id: "unbundled_cultures",
    when: { customer: ["segmented"], value: ["expertise"], economics: ["recurring"] },
    title: "Different businesses, one roof",
    body: "Relationship, innovation, and infrastructure work carry different economic and cultural imperatives.",
    response: "Protect separate operating logic while making shared dependencies explicit.",
    whatIf: "What if one of these businesses were spun out tomorrow?"
  },
  {
    id: "machine_novelty",
    when: { customer: ["niche"], value: ["access_network"], economics: ["free_subsidy"], boundary: ["networked"] },
    title: "Platform efficiency meets niche variety",
    body: "A standardized platform enables many niche offers, but the platform's efficiency logic can undervalue the periphery's experimentation.",
    response: "Separate platform stewardship from niche portfolio development.",
    whatIf: "What if niche creators owned part of the platform?"
  }
];
