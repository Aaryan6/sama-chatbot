import { google } from "@ai-sdk/google";
import { convertToModelMessages, smoothStream, streamText } from "ai";

export const maxDuration = 30;

const personaInfo = {
  sheila: {
    name: "Sheila",
    memories: `
- 31 years old, Marketing Manager, 24 weeks pregnant with baby girl
- Has gestational diabetes, experiencing lower back pain, pregnancy insomnia
- Works from home 3 days/week, flexible schedule, product launch in November
- Prefers prenatal classes and breathwork, avoids early mornings before 8 AM, likes instructor Meera
- No inversions, deep twists, or lying flat, needs props for support, balance issues
- Needs breakfast before morning activity, takes afternoon naps, high-protein diet
- Friends with Anjali and Divya from prenatal class, husband Arjun sometimes joins Sunday classes
- Goals: preparing for childbirth, managing work stress, planning postnatal recovery`,
    calendar: `
Mon Nov 3: 9-10 AM Team standup, 2-3 PM Product launch planning, 3:30-4:30 PM Doctor appointment
Tue Nov 4: 10-11 AM Content calendar planning, 3-4 PM Budget review meeting
Wed Nov 5: 11 AM-12:30 PM Campaign strategy, 2-3 PM 1-on-1 with manager
Thu Nov 6: 9-10 AM Partner brands call, 11 AM-12 PM Analytics review, 2:30-3:30 PM Prenatal class at hospital
Fri Nov 7: 9-10 AM Team standup, 2-3 PM Product launch planning
Sat-Sun: Off days`,
  },
  ritvik: {
    name: "Ritvik",
    memories: `
- 42 years old, Senior Software Engineer, lives in Marathahalli (15 min to Whitefield)
- Elevated cholesterol, history of knee problems, resting heart rate 65 bpm, recent anxiety chest pains
- Demanding tech job, on-call rotations, early riser - productive before 10 AM, at desk by 7:30 AM
- Loves high-intensity cardio yoga, prefers early 6 AM classes, favorite instructor is Rohan
- Avoid high-impact due to knee issues, no marathons, needs joint-friendly cardio
- Wears Garmin watch, tracks all fitness data, intermittent fasting until noon, high-protein diet
- Married to Neha (physician), two kids age 10 and 7, weekday evenings for family, weekend mornings flexible
- Goals: cardiovascular health, target heart rate 140-160 bpm, wants to trek with kids, family history of heart disease`,
    calendar: `
Mon Nov 3: 7:30-8 AM Standup, 10 AM-12 PM Coding, 2-3 PM Cloud review, 3:30-4:30 PM Tech debt discussion
Tue Nov 4: 7:30-8 AM Standup, 9-11 AM Production deployment, 1-2 PM Lunch with PM, 3-5 PM Debug issue
Wed Nov 5: 7:30-8 AM Standup, 10-11 AM Tech talk prep, 11:30 AM-12:30 PM Security review, 2-3:30 PM Retrospective
Thu Nov 6: 7:30-8 AM Standup, 9-10 AM Refactoring, 11 AM-12 PM All-hands, 2-3 PM Performance optimization, 3:30-4:30 PM 1-on-1 with manager
Fri Nov 7: 7:30-8:30 AM Code review, 9:30-10:30 AM Sprint planning, 11 AM-12 PM Architecture discussion, 2-3 PM 1-on-1 with junior dev
Weekday evenings: Family time (blocked)
Sat-Sun: Flexible mornings`,
  },
  gaurav: {
    name: "Gaurav",
    memories: `
- 56 years old, Founder & CEO of e-commerce startup, lives in Indiranagar (25 min to Whitefield)
- Mild hypertension on medication, shoulder and neck stiffness, lower back issues, chronic insomnia improving
- Controls own calendar, protects morning 6-7 AM and evening 6:30-7:30 PM slots, no meetings those times
- Loves mindfulness and breathwork, prefers gentle yoga, favorite instructors Priya and Meera
- Avoid high-intensity cardio, no inversions or advanced strength training, needs props for support
- Reads Bhagavad Gita and Zen Buddhism, practices breathing before meetings, lost 8 kg in 8 months
- Married to Anjali 28 years, two adult children, empty nest, seeking work-life balance
- Goals: mental clarity for decisions, better sleep quality, succession planning, transition to Executive Chairman role`,
    calendar: `
Mon Nov 3: 8-9 AM Executive standup, 9:30-10:30 AM HR hiring, 11 AM-12 PM Sales pipeline, 2:30-3:30 PM Engineering sync, 4-5 PM Customer advisory
Tue Nov 4: 9:30-10:30 AM Board 1-on-1, 11 AM-12 PM Marketing strategy, 3-4 PM Legal review, 4:30-5:30 PM All-hands prep
Wed Nov 5: 8-9 AM Executive meeting, 10-11 AM Investor relations, 2-3 PM Finance deep dive, 3:30-5 PM Strategic initiatives
Thu Nov 6: 9:30-10:30 AM Product demo, 11 AM-12 PM VP Engineering interview, 2:30-3:30 PM Executive coach, 4-5 PM Team culture
Fri Nov 7: 8-9 AM Executive meeting, 10-11 AM Investor call, 2-3 PM Product roadmap, 3:30-5 PM Strategic planning
Sat Nov 8: 2-4 PM Board prep work
Protected slots: 6-7 AM and 6:30-7:30 PM daily (no meetings)`,
  },
};

const samaSchedule = `
SAMA STUDIO SCHEDULE (Nov 3-9, 2025):

Mon Nov 3: 6-7 AM Classical Hatha (Priya) | 7:15-8:15 AM Reformer Pilates (Ananya) | 8:30-9:30 AM Ashtanga Vinyasa (Rohan) | 9:45-10:45 AM Prenatal Gentle (Meera) | 4-5 PM Mindful Strength (Karthik) | 5:15-6:15 PM FireUp Mat Pilates (Ananya) | 6:30-7:30 PM Micro Meditation (Priya)

Tue Nov 4: 6-7 AM Dynamic Vinyasa (Rohan) | 7:15-8:15 AM Wall Pilates (Ananya) | 8:30-9:30 AM Classical Hatha Props (Priya) | 9:45-10:45 AM Prenatal Hatha (Meera) | 4-5 PM Aerial Fitness (Karthik) | 5:15-6:15 PM Reformer Pilates (Ananya) | 6:30-7:30 PM Nervous System Reset (Meera)

Wed Nov 5: 6-7 AM Classical Hatha (Priya) | 7:15-8:15 AM Reformer Pilates (Ananya) | 8:30-9:30 AM FireUp Mat Pilates (Ananya) | 9:45-10:45 AM Prenatal Gentle (Meera) | 4-5 PM Rhythmic Flow (Priya) | 5:15-6:15 PM Mindful Strength (Karthik) | 6:30-7:30 PM Stillness Flow (Meera)

Thu Nov 6: 6-7 AM Ashtanga Vinyasa (Rohan) | 7:15-8:15 AM Wall Pilates (Ananya) | 8:30-9:30 AM Classical Hatha Props (Priya) | 9:45-10:45 AM Prenatal Hatha (Meera) | 4-5 PM Aerial Fitness (Karthik) | 5:15-6:15 PM Reformer Pilates (Ananya) | 6:30-7:30 PM Breathwork (Priya)

Fri Nov 7: 6-7 AM Classical Hatha (Priya) | 7:15-8:15 AM Reformer Pilates (Ananya) | 8:30-9:30 AM Dynamic Vinyasa (Rohan) | 9:45-10:45 AM Prenatal Gentle (Meera) | 4-5 PM Aerial Fitness (Karthik) | 5:15-6:15 PM Wall Pilates (Ananya) | 6:30-7:30 PM Breathwork (Priya)

Sat Nov 8: 6:30-7:30 AM Ashtanga Vinyasa (Rohan) | 7:45-8:45 AM FireUp Mat Pilates (Ananya) | 9-10 AM Mindful Strength (Karthik) | 10:15-11:15 AM Prenatal Hatha (Meera) | 4-5 PM Rhythmic Flow (Priya) | 5:15-6:15 PM Reformer Pilates (Ananya) | 6:30-7:30 PM Nervous System Reset (Meera)

Sun Nov 9: 7-8 AM Classical Hatha Props (Priya) | 8:15-9:15 AM Stillness Flow (Meera) | 9:30-10:30 AM Dynamic Vinyasa (Rohan) | 4:30-5:30 PM Breathwork Session (Priya) | 5:45-6:45 PM Wall Pilates (Ananya)
`;

export async function POST(req: Request) {
  const { messages, persona } = await req.json();

  const selectedPersona = personaInfo[persona as keyof typeof personaInfo];

  if (!selectedPersona) {
    return new Response("Invalid persona", { status: 400 });
  }

  const systemPrompt = `You are a premium wellness scheduling assistant for SAMA Studio in Bangalore. You're helping ${
    selectedPersona.name
  }.

PERSONA INFORMATION:
${selectedPersona.memories}

${selectedPersona.name.toUpperCase()}'S CALENDAR:
${selectedPersona.calendar}

${samaSchedule}

INSTRUCTIONS:
- Be warm, calm, and professional - matching SAMA's mindful wellness approach
- Analyze their schedule to find free time slots
- Match classes to their preferences, health conditions, and goals
- Suggest specific classes with times, considering their constraints
- Be very concise but helpful - no more than 2-3 sentences unless they ask for details
- If they ask about a specific day, check their calendar conflicts and suggest available SAMA classes
- Always mention the instructor name when recommending classes
- Consider their physical limitations and preferences when suggesting classes

Respond naturally and helpfully.`;

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    experimental_transform: smoothStream({
      delayInMs: 30,
      chunking: "word",
    }),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
