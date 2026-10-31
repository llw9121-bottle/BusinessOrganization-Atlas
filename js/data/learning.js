// Plain-language companions to the source framework, not additional diagnoses.
export const formLearning = {
    personal: { plain: "One leader connects the work", diagram: "The central node is the chief; the spokes show direct supervision." },
    programmed: { plain: "Consistent work, coordinated through standards", diagram: "The boxes are roles or units; the branches show a chain of authority." },
    professional: { plain: "Experts decide how to do their work", diagram: "Parallel specialists share professional standards while retaining autonomy." },
    project: { plain: "Flexible expert teams solve new problems", diagram: "The nodes are experts; the connections show collaboration across projects." },
    divisional: { plain: "Independent units, shared direction", diagram: "Headquarters connects separate units and holds them accountable for results." },
    community: { plain: "A shared mission guides decisions", diagram: "The circle connects members through shared purpose rather than a command chain." },
    political: { plain: "Competing interests contest direction", diagram: "Crossing connections represent competing claims on power and priorities." }
};

export const canvasConnections = {
    segments: { related: ["value", "channels", "revenue"], explanation: "A different customer group may need a different offer, a new way to reach it, and a different price." },
    value: { related: ["segments", "activities", "resources"], explanation: "Your promise must solve a customer problem and be supported by the activities and resources that deliver it." },
    relationships: { related: ["segments", "activities", "cost"], explanation: "Personal support and automated service create different expectations, work, and costs." },
    channels: { related: ["segments", "partners", "cost"], explanation: "How you reach customers changes the partners you depend on and the cost of delivering value." },
    revenue: { related: ["segments", "value", "cost"], explanation: "Who pays, what they pay for, and what it costs to serve them must work together." },
    resources: { related: ["value", "partners", "cost"], explanation: "The capabilities behind your offer can be owned or accessed through partners, with different costs and control." },
    activities: { related: ["value", "resources", "cost"], explanation: "The work behind the promise determines the expertise, infrastructure, and spending you need." },
    partners: { related: ["activities", "resources", "channels"], explanation: "Partners can perform work, supply capabilities, or reach customers; each choice moves an organizational boundary." },
    cost: { related: ["activities", "resources", "revenue"], explanation: "Costs follow the work and capabilities you choose; revenue must sustain the system they create." }
};

// A single example follows the learner across views. These are illustrative
// interpretations of the case already documented in the Cases section.
export const searchExample = {
    segments: "Search users seek information; advertisers pay to reach people expressing relevant intent.",
    value: "Users find useful information; advertisers reach potential customers at a relevant moment.",
    relationships: "Search is largely self-service, while advertisers use tools and support to manage campaigns.",
    channels: "Search interfaces connect users to results and provide a route for advertising to reach them.",
    revenue: "Advertising helps fund search access that has no direct charge to users.",
    resources: "Search and advertising depend on technical infrastructure, software, and specialist expertise.",
    activities: "Indexing, ranking, serving results, and operating advertising systems require reliable processes at scale.",
    partners: "The model connects a wider network of publishers, advertisers, and distribution relationships.",
    cost: "Infrastructure, engineering, and operations must be funded while maintaining useful search results."
};

export const lessonNotes = {
    canvas: "Start with the value exchange: users search without a direct charge; advertisers fund the service.",
    bridge: "Follow the FREE pattern, then change one choice to explore your own variation of the example.",
    forms: "Compare standardized operations with expert teams. One enterprise can contain both forms.",
    forces: "Explore efficiency and its counterweight. These sliders illustrate the framework; they do not measure Google.",
    other: "Keep the example in mind as you explore. Return to any step to reconnect the ideas."
};
