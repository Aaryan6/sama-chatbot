import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
import { z } from "zod";

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
- Speak like a caring concierge helping a friend: warm, concise, confident
- Open with 1 short line that references their day (meetings/commitments) to set context
- ALWAYS give a PRIMARY option and, when possible, ONE BACKUP option (earlier or later) that does not conflict with their calendar
- Keep total length to roughly 80–120 words; specific but not verbose
- ONLY suggest classes that truly fit open time; never include conflicting options
- Naturally reference their calendar (e.g., "Since you’re free after 12:30 PM…") and their preferences/constraints
- Use this exact formatting for any class you mention (each on its own line):
  
  **[CLASS_NAME]** | Day: [DAY] | Time: [TIME] | Instructor: [INSTRUCTOR]

- After the options, add one brief rationale sentence tailored to them
- End with a friendly closing question (e.g., "Shall I reserve the first one?")
- Mention instructor only when meaningfully relevant
- Skip marketing language; be practical and personal
- If they ask a simple question, answer in 1–2 sentences

Tone guideline: talk naturally, like you genuinely know them:`;

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    tools: {
      bookClass: {
        description: "Book a class",
        inputSchema: z.object({
          className: z.string(),
          date: z.string(),
          time: z.string(),
          instructor: z.string().optional(),
        }),
        execute: async ({ className, date, time, instructor }) => {
          await new Promise((resolve) => setTimeout(resolve, 6000));
          return {
            success: true,
            message: instructor
              ? `Class ${className} booked for ${date} at ${time} with instructor ${instructor}`
              : `Class ${className} booked for ${date} at ${time}`,
          };
        },
      },
      fetchCalendar: {
        description: "Fetch user's calendar events for a specific date",
        inputSchema: z.object({
          date: z.string(),
        }),
        execute: async ({ date }) => {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          // Dummy events – purely for UI demonstration
          const events = [
            {
              title: "Team standup",
              date,
              time: "7:30-8:00 AM",
              location: "Zoom",
              with: "Eng Team",
            },
            {
              title: "Deep work / Coding",
              date,
              time: "10:00 AM-12:00 PM",
              location: "Home Office",
            },
            {
              title: "1-on-1 with manager",
              date,
              time: "2:00-3:00 PM",
              location: "Conference Room B",
              with: "Manager",
            },
          ];
          return {
            success: true,
            message: `Found ${events.length} events on ${date}.`,
            events,
          } as {
            success: boolean;
            message: string;
            events: Array<{
              title: string;
              date: string;
              time: string;
              location?: string;
              with?: string;
            }>;
          };
        },
      },
    },
    experimental_transform: smoothStream({
      delayInMs: 30,
      chunking: "word",
    }),
    stopWhen: stepCountIs(6),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
