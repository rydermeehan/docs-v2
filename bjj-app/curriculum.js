// ===== BJJ Kids Curriculum Data =====

const MOVES = [
  // Solo Drills
  { id: 'shrimp', name: 'Shrimp / Hip Escape', emoji: '🦐', type: 'solo', category: 'escape',
    desc: 'The most important escape movement in BJJ. Used to create space and escape from bottom positions.',
    steps: ['Lie on your back with knees bent', 'Turn to one side', 'Push off with your feet and bottom hand', 'Slide your hips away from your partner', 'Bring your knee back to guard position'],
    tip: 'Keep your elbows tight! Pretend you are a shrimp curling up.',
    visual: '  [You] → push hips →\n  =====>  =====>  =====>',
    drills: [
      { icon: '🔄', name: 'Basic Shrimp', desc: 'Shrimp across the mat and back (5 reps each side)' },
      { icon: '⚡', name: 'Speed Shrimps', desc: 'As fast as possible for 30 seconds' },
      { icon: '🧱', name: 'Wall Shrimps', desc: 'Shrimp with feet against the wall for resistance' }
    ]
  },
  { id: 'bridge', name: 'Bridge (Upa)', emoji: '🌉', type: 'solo', category: 'escape',
    desc: 'A powerful hip movement to reverse positions. The bridge is your best friend when someone is on top.',
    steps: ['Lie on your back, feet flat on the floor', 'Squeeze your glutes and drive your hips up', 'Push as high as you can', 'Hold for 2 seconds at the top', 'Lower down with control'],
    tip: 'Drive through your heels! Try to touch the ceiling with your belly button.',
    visual: '       /‾‾‾\\\n  ____/     \\____\n  feet       shoulders',
    drills: [
      { icon: '🔄', name: 'Basic Bridge', desc: 'Bridge and hold 3 seconds (10 reps)' },
      { icon: '↗️', name: 'Bridge & Turn', desc: 'Bridge high then turn to one side (5 each side)' },
      { icon: '🧸', name: 'Stuffed Animal Bridge', desc: 'Balance a stuffed animal on your belly while bridging' }
    ]
  },
  { id: 'forward-roll', name: 'Forward Roll', emoji: '🔄', type: 'solo', category: 'movement',
    desc: 'A safe way to fall and recover. Keeps you safe during throws and takedowns.',
    steps: ['Stand with one foot forward', 'Tuck your chin to your chest', 'Reach your lead hand to the ground', 'Roll diagonally across your back', 'Come up to standing position'],
    tip: 'Tuck your chin like you\'re holding a tennis ball under it. Roll over your shoulder, not your head!',
    visual: '  Stand → Tuck → Roll → Stand\n  🧍 →  🏃 →  🔄  → 🧍',
    drills: [
      { icon: '🔄', name: 'Slow Rolls', desc: 'Focus on smooth, controlled rolls (5 each side)' },
      { icon: '⚡', name: 'Continuous Rolls', desc: 'Roll forward, stand up, roll again without stopping' },
      { icon: '🔙', name: 'Backward Rolls', desc: 'Same concept but rolling backward' }
    ]
  },
  { id: 'technical-standup', name: 'Technical Stand-Up', emoji: '🧍', type: 'solo', category: 'movement',
    desc: 'The safe way to stand up when someone is in front of you. Keeps you protected while getting to your feet.',
    steps: ['Sit on the ground with one hand posted behind you', 'Kick your front leg out for distance', 'Post on your back hand and opposite foot', 'Lift your hips high off the ground', 'Swing your posted leg back and stand up in fighting stance'],
    tip: 'Always keep one hand up to protect your face while standing. Never stand up with both hands on the ground!',
    visual: '  Sit → Post → Lift → Stand\n  👇  →  ✋  →  ⬆️  →  🧍',
    drills: [
      { icon: '🔄', name: 'Basic Tech Stand', desc: 'Practice 10 reps each side' },
      { icon: '⚡', name: 'Speed Stand-Ups', desc: 'Down and up as fast as possible (30 sec)' },
      { icon: '🎯', name: 'Stand to Stance', desc: 'Technical stand-up into fighting stance' }
    ]
  },
  { id: 'bear-crawl', name: 'Bear Crawl', emoji: '🐻', type: 'solo', category: 'movement',
    desc: 'A full-body movement that builds strength and coordination. Great for warming up and developing BJJ-specific fitness.',
    steps: ['Start on hands and feet (not knees)', 'Keep your hips low and back flat', 'Move opposite hand and foot together', 'Keep your knees close to the ground', 'Move forward, backward, and sideways'],
    tip: 'Pretend you are a sneaky bear! Stay low and quiet.',
    visual: '  🐻 →→→ →→→ →→→\n  hands + feet, hips LOW',
    drills: [
      { icon: '➡️', name: 'Forward Bear Crawl', desc: 'Crawl forward across the mat' },
      { icon: '⬅️', name: 'Backward Bear Crawl', desc: 'Crawl backward (harder!)' },
      { icon: '↔️', name: 'Lateral Bear Crawl', desc: 'Crawl sideways both directions' }
    ]
  },
  { id: 'breakfall', name: 'Breakfall', emoji: '🤸', type: 'solo', category: 'safety',
    desc: 'How to fall safely! The most important safety skill in BJJ. Learning to breakfall prevents injuries.',
    steps: ['Start standing or from knees', 'Tuck your chin to your chest', 'Round your back as you fall', 'Slap both arms on the ground as you land', 'Arms hit at 45 degrees from your body'],
    tip: 'Slap the ground HARD with your arms - this spreads out the impact. Never put your hands out to catch yourself!',
    visual: '  🧍 → fall → SLAP!\n          \\ 💥 /\n       arms at 45°',
    drills: [
      { icon: '🔄', name: 'Seated Breakfall', desc: 'Practice from seated position first' },
      { icon: '⬆️', name: 'Standing Breakfall', desc: 'Progress to standing breakfalls' },
      { icon: '↔️', name: 'Side Breakfall', desc: 'Practice falling to each side' }
    ]
  },

  // Partner Drills
  { id: 'guard-pass', name: 'Basic Guard Pass', emoji: '🚪', type: 'partner', category: 'passing',
    desc: 'How to get past your partner\'s legs when they have you in their guard.',
    steps: ['Start in your partner\'s closed guard', 'Put both hands on their hips', 'Stand up with good posture (one foot at a time)', 'Push one knee down with your hand', 'Step over their leg and settle into side control'],
    tip: 'Stand up TALL with a straight back! If you hunch over, they can pull you back down.',
    visual: '  In Guard → Stand → Push knee → Pass!\n  🧎→🧍→✋🦵→ Side Control',
    drills: [
      { icon: '🔄', name: 'Drill the Pass', desc: 'Practice the full sequence 5 times each side' },
      { icon: '🐢', name: 'Slow Pass', desc: 'Super slow with perfect technique' },
      { icon: '🏃', name: 'Pass Sparring', desc: 'Partner tries to keep guard while you pass' }
    ]
  },
  { id: 'closed-guard', name: 'Closed Guard Control', emoji: '🔒', type: 'partner', category: 'guard',
    desc: 'The fundamental bottom position. Your legs are wrapped around your partner controlling them.',
    steps: ['Wrap your legs around partner\'s waist', 'Lock your ankles behind their back', 'Control one of their wrists with your hand', 'Grab behind their head with your other hand', 'Keep them close - don\'t let them posture up'],
    tip: 'Your legs are your best weapon from here! Squeeze with your knees and keep your partner close.',
    visual: '  You (bottom): 🦵🔒🦵\n  Partner (top):  🧎\n  Your legs locked around them!',
    drills: [
      { icon: '🔄', name: 'Guard Holding', desc: 'Hold closed guard for 30 seconds while partner tries to escape' },
      { icon: '✋', name: 'Break & Re-close', desc: 'Partner opens guard, quickly re-close it' },
      { icon: '🔄', name: 'Guard to Sweep', desc: 'Practice hip bump sweep from guard' }
    ]
  },
  { id: 'mount-escape', name: 'Mount Escape (Trap & Roll)', emoji: '🔄', type: 'partner', category: 'escape',
    desc: 'The fundamental escape when someone is sitting on top of you (mounted). Also called the Upa escape.',
    steps: ['Trap their wrist - grab and hold tight!', 'Trap their foot on the same side with your foot', 'Bridge HIGH - drive your hips to the ceiling', 'Turn over the trapped side', 'You end up in their guard - you escaped!'],
    tip: 'The secret is trapping BOTH the hand and foot on the SAME side. Without both trapped, the roll won\'t work!',
    visual: '  Trap hand + foot → Bridge → Roll!\n  ✋🦶 same side → 🌉 → 🔄',
    drills: [
      { icon: '🔄', name: 'Slow Trap & Roll', desc: 'Step by step, 5 each side' },
      { icon: '⚡', name: 'Quick Escapes', desc: 'Escape as fast as possible' },
      { icon: '💪', name: 'Resistance Drill', desc: 'Partner adds light resistance' }
    ]
  },
  { id: 'side-control', name: 'Side Control Hold', emoji: '📌', type: 'partner', category: 'control',
    desc: 'A strong top position from the side. Learn to hold and control your partner here.',
    steps: ['Lie across your partner\'s chest', 'Keep your hip pressure down - be heavy!', 'Control their far arm with your near hand', 'Underhook their near arm with your other hand', 'Sprawl your legs back for base', 'Keep your head low on the far side'],
    tip: 'Be a HEAVY blanket! Don\'t hold yourself up - let your weight do the work.',
    visual: '  You: ──────\n  Partner: ======\n  Chest-to-chest, hips LOW',
    drills: [
      { icon: '⏱️', name: 'Hold for Time', desc: 'Hold side control for 30 seconds' },
      { icon: '🔄', name: 'Switch Sides', desc: 'Move from one side to the other smoothly' },
      { icon: '🏃', name: 'Escape vs Hold', desc: 'Take turns escaping and holding' }
    ]
  },
  { id: 'takedown-double', name: 'Double Leg Takedown', emoji: '🤼', type: 'partner', category: 'takedown',
    desc: 'A fundamental wrestling takedown. Change levels, shoot in, and take your partner to the ground safely.',
    steps: ['Start in fighting stance facing your partner', 'Lower your level by bending your knees (not your back!)', 'Step forward with your lead foot', 'Wrap both arms around their legs above the knees', 'Drive forward with your shoulder in their hip', 'Lift and turn to take them down safely'],
    tip: 'Change levels BEFORE you shoot! If you just dive forward, they\'ll see it coming. Bend your knees first.',
    visual: '  Stance → Level Change → Shoot!\n  🧍→ 🏃(low) → 🤼 → Takedown!',
    drills: [
      { icon: '🔄', name: 'Shadow Shots', desc: 'Practice the level change and shot without a partner' },
      { icon: '🧸', name: 'Dummy Double Legs', desc: 'Practice on a heavy bag or dummy' },
      { icon: '🤝', name: 'Partner Drill', desc: 'Light double legs with a cooperative partner' }
    ]
  },
  { id: 'armbar', name: 'Armbar from Guard', emoji: '💪', type: 'partner', category: 'submission',
    desc: 'The king of submissions! Control your partner\'s arm and extend it using your hips for a tap.',
    steps: ['Start in closed guard, control one wrist', 'Put your foot on their hip (same side as trapped arm)', 'Swing your other leg over their head', 'Squeeze your knees together', 'Hold their wrist with both hands, thumb up', 'Lift your hips slowly for the tap (BE GENTLE!)'],
    tip: 'GO SLOW on the finish! When you lift your hips, do it gently. As soon as your partner taps, LET GO immediately!',
    visual: '  Guard → Foot on hip → Leg over → Squeeze!\n  🦵hip → 🦶 → 🦵head → Tap!',
    drills: [
      { icon: '🔄', name: 'Step by Step', desc: 'Practice each step slowly, 5 each side' },
      { icon: '🔁', name: 'Rep It Out', desc: 'Full armbar flow, gentle finish (10 reps)' },
      { icon: '💡', name: 'Setup Drill', desc: 'Practice the grip break to armbar setup' }
    ]
  },

  // Dummy/Solo Situational
  { id: 'guard-recovery', name: 'Guard Recovery', emoji: '🛡️', type: 'solo', category: 'guard',
    desc: 'Getting back to guard when your opponent passes. Uses the shrimp motion to recover your legs.',
    steps: ['Start on your back with partner past your legs', 'Frame against their shoulder with your arms', 'Shrimp your hips away', 'Bring your inside knee through', 'Re-establish your guard position'],
    tip: 'Never lie flat! Always be on your side, always be shrimping!',
    visual: '  Passed → Frame → Shrimp → Guard!\n  😰 → ✋ → 🦐 → 🔒',
    drills: [
      { icon: '🔄', name: 'Solo Shrimp to Guard', desc: 'Shrimp and bring knees in (10 reps)' },
      { icon: '⚡', name: 'Speed Recovery', desc: 'Fast shrimp to guard, both sides' },
      { icon: '🧱', name: 'Wall Recovery', desc: 'Use wall to simulate pressure while recovering guard' }
    ]
  },
  { id: 'kimura', name: 'Kimura', emoji: '🔑', type: 'partner', category: 'submission',
    desc: 'A powerful shoulder lock that you can hit from many positions. Named after the legendary Masahiko Kimura.',
    steps: ['From side control or guard, grab their wrist', 'Feed your other hand under their arm', 'Grab your own wrist (figure-four grip)', 'Keep their arm bent at 90 degrees', 'Slowly rotate their hand toward their back', 'Stop when they tap!'],
    tip: 'The figure-four grip is the key! Your grip hand grabs their wrist, your other hand goes UNDER their arm and grabs your own wrist.',
    visual: '  Grab wrist → Under arm → Your wrist\n  ✋→🦾→ Figure-4 grip → Rotate',
    drills: [
      { icon: '🔄', name: 'Grip Drill', desc: 'Practice getting the figure-four grip (10 reps)' },
      { icon: '🔁', name: 'Full Kimura', desc: 'Complete kimura from side control (5 each side)' },
      { icon: '📌', name: 'Kimura Trap', desc: 'Use kimura grip to sweep from guard' }
    ]
  },
  { id: 'scissor-sweep', name: 'Scissor Sweep', emoji: '✂️', type: 'partner', category: 'sweep',
    desc: 'A fundamental sweep from guard. Use your legs like scissors to knock your partner over.',
    steps: ['From closed guard, get a collar and sleeve grip', 'Open your guard and put your shin across their belly', 'Your other leg goes on the ground, foot by their knee', 'Pull them forward with your grips', 'Scissor your legs - top leg pushes, bottom leg sweeps', 'Follow them over into mount!'],
    tip: 'The shin across the belly is like a shelf - pull them onto it, then sweep! Timing is everything.',
    visual: '  Guard → Shin across → Scissor!\n  🦵across + 🦵sweep = 🔄→ Mount!',
    drills: [
      { icon: '🔄', name: 'Setup Drill', desc: 'Practice getting grips and shin position' },
      { icon: '✂️', name: 'Scissor Motion', desc: 'Focus on the leg motion (5 each side)' },
      { icon: '🏆', name: 'Sweep to Mount', desc: 'Full sweep finishing in mount position' }
    ]
  },
  { id: 'rear-naked-choke', name: 'Rear Naked Choke', emoji: '🐍', type: 'partner', category: 'submission',
    desc: 'The most effective submission! Applied from the back position, this is a blood choke (not an air choke).',
    steps: ['Take the back with your hooks (feet) in', 'Slide your choking arm under their chin', 'Grab your own bicep with the choking hand', 'Put your other hand behind their head', 'Squeeze your elbows together gently', 'STOP immediately when they tap!'],
    tip: 'This is a SQUEEZE, not a crank! Bring your elbows together like you\'re hugging. Always be gentle and stop at the tap!',
    visual: '  Back control → Arm under chin → Squeeze\n  🔙 → 🦾(under chin) → 💤(gentle!)',
    drills: [
      { icon: '🔄', name: 'Hand Position Drill', desc: 'Practice getting the right hand position' },
      { icon: '🔁', name: 'Back to RNC', desc: 'Take back then apply RNC (gentle!)' },
      { icon: '🛡️', name: 'RNC Defense', desc: 'Practice defending the RNC (tuck chin, fight hands)' }
    ]
  }
];

const CURRICULUM = [
  // Phase 1: Foundation (Weeks 1-8)
  { week: 1, phase: 1, title: 'Welcome to BJJ!', focus: 'Basic movements & safety',
    moves: ['shrimp', 'bridge', 'breakfall'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Jog in place, arm circles, jumping jacks', details: ['30 seconds jogging in place', '10 arm circles each direction', '10 jumping jacks', 'Stretch: touch toes, butterfly stretch'] },
      { name: 'Breakfalls', time: '5 min', desc: 'Learn to fall safely', details: ['Seated breakfall practice (5 each side)', 'Focus on slapping the mat', 'Chin tucked, round back'] },
      { name: 'Shrimping', time: '8 min', desc: 'The most important movement in BJJ', details: ['Demo the shrimp/hip escape', 'Slow shrimps across the mat (5 reps)', 'Focus: push with feet, slide hips', 'Speed shrimps (3 reps each side)'] },
      { name: 'Bridging', time: '7 min', desc: 'Build your bridge power', details: ['Basic bridge and hold (5 reps, hold 3 sec)', 'Bridge and turn to each side (3 each)', 'Fun: balance a stuffed animal while bridging'] },
      { name: 'Cool Down & Review', time: '5 min', desc: 'Stretch and recap', details: ['Easy stretching', 'What did we learn today?', 'OSS! (BJJ greeting/respect)'] }
    ]
  },
  { week: 2, phase: 1, title: 'Movement Masters', focus: 'Rolls, stand-ups & crawling',
    moves: ['forward-roll', 'technical-standup', 'bear-crawl'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Movement warm-up', details: ['Bear crawls across the mat', 'Crab walks back', 'Inchworms (3 reps)'] },
      { name: 'Review: Shrimp & Bridge', time: '5 min', desc: 'Quick review of Week 1', details: ['5 shrimps each side', '5 bridges with turn'] },
      { name: 'Forward Rolls', time: '8 min', desc: 'Safe falling and rolling', details: ['Demo the forward roll', 'Start from knees first', 'Progress to standing', 'Chin tucked! Roll over shoulder!'] },
      { name: 'Technical Stand-Up', time: '7 min', desc: 'Getting up safely', details: ['Demo technical stand-up', 'Practice from seated (10 reps each side)', 'Key: hand up to protect face!'] },
      { name: 'Movement Circuit', time: '5 min', desc: 'Combine all movements', details: ['Bear crawl → forward roll → technical stand-up', 'Repeat 3 times', 'Make it a fun obstacle course!'] }
    ]
  },
  { week: 3, phase: 1, title: 'Guard Basics', focus: 'Closed guard & guard pass',
    moves: ['closed-guard', 'guard-pass', 'shrimp'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Solo movement warm-up', details: ['Shrimps (5 each side)', 'Bridges (5 reps)', 'Forward rolls (3 each side)'] },
      { name: 'Closed Guard', time: '10 min', desc: 'Your first real BJJ position', details: ['Demo closed guard position', 'Practice locking ankles behind partner', 'Learn wrist and head control', 'Hold guard while partner tries to posture (30 sec)'] },
      { name: 'Basic Guard Pass', time: '10 min', desc: 'How to get past the guard', details: ['Demo the stand-up guard pass', 'Practice standing up in guard', 'Push knee, step over', 'Full pass to side control (5 reps each side)'] },
      { name: 'Positional Sparring', time: '5 min', desc: 'Guard vs. pass', details: ['One person in guard, one tries to pass', '1-minute rounds, then switch roles', 'Light and technical, no strength!'] }
    ]
  },
  { week: 4, phase: 1, title: 'Escape Artist', focus: 'Mount escape & side control escape',
    moves: ['mount-escape', 'side-control', 'bridge'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Bridge-focused warm-up', details: ['Bridges with turn (5 each side)', 'Shrimps (5 each side)', 'Bear crawls (2 lengths)'] },
      { name: 'Side Control', time: '8 min', desc: 'Learn the side control position', details: ['Demo side control position', 'Practice holding with proper pressure', 'Key points: chest pressure, sprawled legs', 'Hold for 30 seconds each side'] },
      { name: 'Mount Escape', time: '10 min', desc: 'Trap and Roll escape', details: ['Demo the Trap & Roll', 'Practice trapping hand and foot', 'Bridge and roll (5 each side)', 'Key: same side hand AND foot!'] },
      { name: 'Escape Sparring', time: '7 min', desc: 'Practice escaping', details: ['Start in mount, try to escape', '1-minute rounds', 'Switch top and bottom', 'Celebrate every successful escape!'] }
    ]
  },
  { week: 5, phase: 1, title: 'Putting It Together 1', focus: 'Review & flow drilling',
    moves: ['shrimp', 'bridge', 'closed-guard', 'mount-escape'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Full movement warm-up', details: ['All movements: shrimp, bridge, roll, bear crawl', '3 reps of each'] },
      { name: 'Technique Review', time: '10 min', desc: 'Review all moves so far', details: ['Closed guard → guard pass (3 each side)', 'Mount escape → trap & roll (3 each side)', 'Side control hold (30 sec each side)'] },
      { name: 'Flow Drill', time: '8 min', desc: 'Combine positions', details: ['Guard → pass → side control → mount → escape', 'Go through the flow slowly', 'No resistance, just movement', 'Repeat 3 times then switch roles'] },
      { name: 'Light Sparring', time: '7 min', desc: 'Very light positional sparring', details: ['Start from knees', 'Goal: use any technique we\'ve learned', '2-minute rounds with breaks', 'Focus on using technique, not strength'] }
    ]
  },
  { week: 6, phase: 1, title: 'Takedown Basics', focus: 'Double leg & wrestling stance',
    moves: ['takedown-double', 'breakfall', 'technical-standup'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Wrestling warm-up', details: ['Jog in place with level changes', 'Sprawl practice (5 reps)', 'Shot practice without partner (5 reps)'] },
      { name: 'Fighting Stance', time: '5 min', desc: 'The wrestling stance', details: ['Feet shoulder width, staggered', 'Knees bent, hands up', 'Practice moving in stance: forward, back, circle'] },
      { name: 'Double Leg Takedown', time: '12 min', desc: 'Your first takedown', details: ['Demo the double leg', 'Practice level change (10 reps)', 'Practice the shot without contact', 'Full double leg with partner (5 each side)', 'Key: change level BEFORE shooting'] },
      { name: 'Breakfall Practice', time: '5 min', desc: 'Safe falling from standing', details: ['Partner gently guides you down', 'Practice breakfall when taken down', 'Never put hands out to catch yourself!'] },
      { name: 'Takedown Sparring', time: '3 min', desc: 'Light takedown practice', details: ['Start standing', 'Very light, cooperative partner', 'Practice the shot and finish'] }
    ]
  },
  { week: 7, phase: 1, title: 'First Submission', focus: 'Armbar from guard',
    moves: ['armbar', 'closed-guard', 'guard-pass'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Guard movement warm-up', details: ['Hip escapes (5 each side)', 'Leg circles in the air', 'Bridge to guard recovery'] },
      { name: 'Guard Review', time: '5 min', desc: 'Quick closed guard review', details: ['Practice closed guard control', 'Breaking posture drill'] },
      { name: 'Armbar from Guard', time: '12 min', desc: 'The king of submissions!', details: ['Demo the armbar step by step', 'Practice foot on hip (5 each side)', 'Practice leg over head (5 each side)', 'Full armbar (5 each side)', 'IMPORTANT: Be gentle! Slow finish!'] },
      { name: 'Attack & Defend', time: '5 min', desc: 'Armbar practice with light resistance', details: ['One person attacks armbar, partner defends', '1-minute rounds', 'Switch attacker/defender', 'Remember: TAP EARLY!'] },
      { name: 'Cool Down', time: '3 min', desc: 'Stretch and review', details: ['Stretch hips and shoulders', 'Review armbar key points'] }
    ]
  },
  { week: 8, phase: 1, title: 'Foundation Test', focus: 'Review & first stripe test!',
    moves: ['shrimp', 'bridge', 'forward-roll', 'mount-escape', 'closed-guard', 'armbar'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Complete warm-up', details: ['All solo movements', '2 reps of each'] },
      { name: 'Technique Showcase', time: '15 min', desc: 'Show what you know!', details: ['Shrimps across the mat', 'Bridges with turns', 'Forward rolls', 'Technical stand-ups', 'Closed guard control (30 sec)', 'Guard pass (both sides)', 'Mount escape (both sides)', 'Armbar from guard (both sides)'] },
      { name: 'Fun Sparring', time: '5 min', desc: 'Celebrate with sparring', details: ['Light sparring from knees', 'Use everything you\'ve learned!', 'Have fun!'] },
      { name: 'Stripe Ceremony!', time: '5 min', desc: 'Earn your first stripe!', details: ['🎉 Congratulations! First stripe earned!', 'OSS! You\'ve completed Foundation Phase!'] }
    ]
  },

  // Phase 2: Building (Weeks 9-16)
  { week: 9, phase: 2, title: 'Guard Game 2.0', focus: 'Scissor sweep & guard recovery',
    moves: ['scissor-sweep', 'guard-recovery', 'closed-guard'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Guard-focused warm-up', details: ['Hip escapes (5 each side)', 'Guard sit-ups (10 reps)', 'Leg pummel drill'] },
      { name: 'Guard Recovery', time: '8 min', desc: 'Getting back to guard', details: ['Demo guard recovery', 'Frame, shrimp, bring knee through', 'Practice solo (5 each side)', 'Practice with partner (5 each side)'] },
      { name: 'Scissor Sweep', time: '10 min', desc: 'Your first sweep!', details: ['Demo scissor sweep', 'Practice grips and shin position', 'Scissor motion drill (5 each side)', 'Full sweep to mount (5 each side)'] },
      { name: 'Guard Flow', time: '7 min', desc: 'Chain techniques together', details: ['Closed guard → scissor sweep attempt', 'If blocked → switch to armbar', 'Flow between attacks'] }
    ]
  },
  { week: 10, phase: 2, title: 'Submission Hunter', focus: 'Kimura & submission chains',
    moves: ['kimura', 'armbar', 'side-control'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Grip-focused warm-up', details: ['Wrist circles', 'Grip exercises with towel', 'Shrimps and bridges'] },
      { name: 'Kimura', time: '12 min', desc: 'The mighty kimura lock', details: ['Demo the figure-four grip', 'Practice grip from side control', 'Full kimura from side control (5 each side)', 'Key: grab wrist, under arm, grab own wrist'] },
      { name: 'Submission Chain', time: '8 min', desc: 'Armbar to kimura and back', details: ['If armbar is defended → switch to kimura', 'If kimura is defended → switch to armbar', 'Practice the chain (5 reps)'] },
      { name: 'Sub Hunting', time: '5 min', desc: 'Light submission sparring', details: ['Start in side control', 'Hunt for kimura or armbar', '1-minute rounds, switch roles'] }
    ]
  },
  { week: 11, phase: 2, title: 'Back Attack', focus: 'Taking the back & RNC',
    moves: ['rear-naked-choke', 'mount-escape', 'side-control'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Movement warm-up', details: ['Seat belt drill', 'Hook fighting from back', 'Solo back take movement'] },
      { name: 'Taking the Back', time: '8 min', desc: 'Get to the best position', details: ['From side control → take the back', 'Get your hooks in', 'Seat belt grip', 'Practice 5 times each side'] },
      { name: 'Rear Naked Choke', time: '10 min', desc: 'The most powerful submission', details: ['Demo the RNC', 'Hand position under chin', 'Grab bicep, hand behind head', 'Gentle squeeze (5 each side)', 'MUST be gentle! Stop at tap!'] },
      { name: 'Back Sparring', time: '7 min', desc: 'Attack and defend the back', details: ['One person has the back, hunt for RNC', 'Other person defends and tries to escape', '1-minute rounds, switch'] }
    ]
  },
  { week: 12, phase: 2, title: 'Putting It Together 2', focus: 'Flow & combinations',
    moves: ['scissor-sweep', 'kimura', 'rear-naked-choke', 'armbar'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Complete warm-up', details: ['All solo movements', 'Quick and focused'] },
      { name: 'Big Flow Drill', time: '12 min', desc: 'Complete BJJ flow', details: ['Guard → scissor sweep → mount', '→ partner escapes → you take side control', '→ kimura attempt → take back', '→ RNC attempt', 'Switch roles and repeat', 'Go slow, focus on smooth transitions'] },
      { name: 'Technique Sparring', time: '8 min', desc: 'Use everything!', details: ['Start from knees', '2-minute rounds', 'Focus on chaining techniques', 'If one thing doesn\'t work, try another'] },
      { name: 'Review', time: '5 min', desc: 'What\'s working?', details: ['What\'s your favorite technique?', 'What needs more practice?', 'Set goals for next week'] }
    ]
  },
  { week: 13, phase: 2, title: 'Wrestling Upgrade', focus: 'Improved takedowns & defense',
    moves: ['takedown-double', 'breakfall', 'technical-standup'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Wrestling warm-up', details: ['Level changes (10 reps)', 'Sprawls (10 reps)', 'Shot drills (10 reps)'] },
      { name: 'Double Leg Review', time: '8 min', desc: 'Better double legs', details: ['Review the double leg', 'Focus on penetration step', 'Finish: lift and turn', '5 reps each side'] },
      { name: 'Takedown Defense', time: '8 min', desc: 'Sprawl and defend', details: ['Demo the sprawl', 'Partner shoots, you sprawl', 'Key: hips DOWN, legs BACK', '5 sprawls each'] },
      { name: 'Standup Sparring', time: '7 min', desc: 'Light standing practice', details: ['Start standing', 'One attacks, one defends', 'Switch roles each round', '1-minute rounds'] },
      { name: 'Cool Down', time: '2 min', desc: 'Stretch and review', details: ['Leg stretches', 'Celebrate improvements!'] }
    ]
  },
  { week: 14, phase: 2, title: 'Advanced Guard', focus: 'Open guard concepts',
    moves: ['guard-recovery', 'scissor-sweep', 'closed-guard'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Hip mobility warm-up', details: ['Hip circles', 'Leg pummeling', 'Guard retention movement'] },
      { name: 'Open Guard Basics', time: '10 min', desc: 'Beyond closed guard', details: ['Feet on hips guard', 'Sleeve and collar grips', 'Practice maintaining distance', 'If they get close → close your guard'] },
      { name: 'Guard Retention', time: '8 min', desc: 'Never let them pass!', details: ['Partner tries to pass', 'Use frames, shrimps, and leg movements', 'Always face your partner', 'Re-guard whenever possible'] },
      { name: 'Guard Sparring', time: '7 min', desc: 'Guard player vs passer', details: ['One plays guard, one passes', 'Guard player scores with sweeps', 'Passer scores with passes', '2-minute rounds'] }
    ]
  },
  { week: 15, phase: 2, title: 'Escape Master', focus: 'Advanced escapes',
    moves: ['mount-escape', 'guard-recovery', 'shrimp'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Escape movement warm-up', details: ['Shrimps (10 each side)', 'Bridges (10 reps)', 'Sit-outs (5 each side)'] },
      { name: 'Side Control Escape', time: '10 min', desc: 'Shrimp escape from side control', details: ['Frame on neck and hip', 'Shrimp to create space', 'Bring knee through to guard', 'Practice 5 each side'] },
      { name: 'Mount Escape Review', time: '5 min', desc: 'Sharpen the trap & roll', details: ['Trap and roll review (3 each side)', 'Add: elbow-knee escape from mount'] },
      { name: 'Escape Chain', time: '5 min', desc: 'Chain escapes together', details: ['Try trap & roll → if blocked → shrimp escape', 'Always have a Plan B!'] },
      { name: 'Escape Sparring', time: '5 min', desc: 'Start in bad positions', details: ['Start under mount or side control', 'Goal: escape to guard', '1-minute rounds, switch'] }
    ]
  },
  { week: 16, phase: 2, title: 'Second Stripe Test!', focus: 'Review & second stripe!',
    moves: ['scissor-sweep', 'kimura', 'rear-naked-choke', 'guard-recovery'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Light warm-up', details: ['Easy movement review', 'Get loose and focused'] },
      { name: 'Technique Test', time: '15 min', desc: 'Show your skills!', details: ['All Phase 1 techniques (quick review)', 'Scissor sweep (both sides)', 'Kimura from side control (both sides)', 'Take the back → RNC', 'Guard recovery drill', 'Takedown defense (sprawl)'] },
      { name: 'Sparring Showcase', time: '5 min', desc: 'Show it in action', details: ['Light sparring rounds', 'Demonstrate technique chains', 'Show good sportsmanship'] },
      { name: 'Stripe Ceremony!', time: '5 min', desc: 'Second stripe earned!', details: ['🎉 Amazing progress!', 'Two stripes on your belt!', 'You\'re becoming a real martial artist!'] }
    ]
  },

  // Phase 3: Competition Prep (Weeks 17-24)
  { week: 17, phase: 3, title: 'Competition Mindset', focus: 'Tournament rules & strategy',
    moves: ['takedown-double', 'guard-pass', 'mount-escape'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Competition-style warm-up', details: ['Intense movement drill', 'Get the heart pumping!', 'Shadow grappling (move like you\'re competing)'] },
      { name: 'Tournament Rules', time: '8 min', desc: 'How competitions work', details: ['Points: takedown (2), sweep (2), pass (3), mount/back (4)', 'Advantages and penalties', 'Match length for kids: 3-5 minutes', 'Legal and illegal techniques for your age'] },
      { name: 'Point Scoring Drill', time: '10 min', desc: 'Practice scoring points', details: ['Takedown → pass → mount (9 points!)', 'Sweep → pass → mount (9 points!)', 'Practice the highest-scoring sequences'] },
      { name: 'Timed Rounds', time: '7 min', desc: 'Competition-length sparring', details: ['3-minute rounds with rest', 'Practice pacing yourself', 'Stay technical under pressure'] }
    ]
  },
  { week: 18, phase: 3, title: 'Takedown to Finish', focus: 'Complete sequences standing to ground',
    moves: ['takedown-double', 'guard-pass', 'armbar'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Takedown warm-up', details: ['Level changes', 'Shots without partner', 'Sprawls'] },
      { name: 'Takedown to Pass', time: '10 min', desc: 'Don\'t stop after the takedown!', details: ['Double leg → immediately pass guard', 'Practice the connection between takedown and pass', '5 complete sequences each side'] },
      { name: 'Complete Sequence', time: '10 min', desc: 'Takedown to submission', details: ['Double leg → pass → side control → submission', 'Chain everything together', 'Focus on smooth transitions'] },
      { name: 'Competition Round', time: '5 min', desc: 'Simulate a match', details: ['Start standing', '3-minute round', 'Try for a complete sequence', 'Switch partners'] }
    ]
  },
  { week: 19, phase: 3, title: 'Guard Pulls & Strategy', focus: 'When to pull guard vs takedown',
    moves: ['closed-guard', 'scissor-sweep', 'armbar'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Guard warm-up', details: ['Hip escapes', 'Guard sit-ups', 'Leg dexterity drills'] },
      { name: 'Guard Pull', time: '8 min', desc: 'How to pull guard safely', details: ['Grip → sit down → closed guard', 'When to pull guard vs take down', 'Immediate attack after pulling guard'] },
      { name: 'Guard Attack Chain', time: '10 min', desc: 'Submissions from guard', details: ['Pull guard → scissor sweep attempt', 'If blocked → armbar attempt', 'If blocked → kimura attempt', 'Keep attacking!'] },
      { name: 'Strategy Rounds', time: '7 min', desc: 'Practice your game plan', details: ['Round 1: Top game - takedown, pass, control', 'Round 2: Bottom game - pull guard, sweep, submit', 'Find which game suits you better!'] }
    ]
  },
  { week: 20, phase: 3, title: 'Defense & Resilience', focus: 'Surviving bad positions',
    moves: ['mount-escape', 'guard-recovery', 'rear-naked-choke'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Defensive warm-up', details: ['Shrimps (many!)', 'Bridges (many!)', 'Turtle position movement'] },
      { name: 'Survival Mode', time: '10 min', desc: 'Stay calm in bad spots', details: ['Under mount: protect neck, frame, breathe', 'Under side control: frames, don\'t panic', 'Back taken: protect neck, fight hands', 'Key: STAY CALM, breathe, then escape'] },
      { name: 'Escape Chains', time: '8 min', desc: 'Multiple escape options', details: ['Mount: trap & roll → elbow-knee → re-guard', 'Side control: frame → shrimp → re-guard', 'Back: defend choke → turn in → guard'] },
      { name: 'Shark Tank', time: '7 min', desc: 'Defend against fresh opponents', details: ['Start in a bad position', 'Escape, then partner resets you', 'Build mental toughness!', 'It\'s okay to get caught - just keep trying!'] }
    ]
  },
  { week: 21, phase: 3, title: 'Speed & Timing', focus: 'Fast technique & reaction drills',
    moves: ['scissor-sweep', 'armbar', 'takedown-double'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Speed warm-up', details: ['Quick feet drills', 'Reaction clap game', 'Fast shrimps'] },
      { name: 'Speed Drilling', time: '10 min', desc: 'Technique at speed', details: ['Armbar from guard - 10 reps fast!', 'Scissor sweep - 10 reps fast!', 'Guard pass - 10 reps fast!', 'Focus: speed with good technique'] },
      { name: 'Reaction Drills', time: '8 min', desc: 'React to what your partner does', details: ['Partner pushes → you sweep', 'Partner pulls → you pass', 'Partner reaches → you armbar', 'Read and react!'] },
      { name: 'Fast Rounds', time: '7 min', desc: 'Short, intense rounds', details: ['1-minute rounds', 'High intensity', '30-second rest between', 'Simulate tournament pace'] }
    ]
  },
  { week: 22, phase: 3, title: 'Game Planning', focus: 'Build your personal game',
    moves: ['takedown-double', 'closed-guard', 'kimura', 'rear-naked-choke'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Light warm-up', details: ['Movement flow', 'Get loose'] },
      { name: 'Your Game Plan', time: '10 min', desc: 'What\'s YOUR style?', details: ['Choose your favorite takedown or guard pull', 'Choose your best pass or sweep', 'Choose your go-to submission', 'Practice YOUR sequence 10 times'] },
      { name: 'Plan B', time: '8 min', desc: 'When Plan A doesn\'t work', details: ['What if your takedown fails?', 'What if your sweep is blocked?', 'What if your submission is defended?', 'Always have a backup plan!'] },
      { name: 'Match Simulation', time: '7 min', desc: 'Full competition simulation', details: ['Start standing, shake hands', '3-minute match', 'Use your game plan', 'Dad plays referee!'] }
    ]
  },
  { week: 23, phase: 3, title: 'Tournament Week Prep', focus: 'Final preparation & mental game',
    moves: ['takedown-double', 'guard-pass', 'scissor-sweep', 'armbar'],
    segments: [
      { name: 'Light Warm-Up', time: '5 min', desc: 'Easy movement', details: ['Light jogging', 'Gentle stretching', 'Easy movement flow'] },
      { name: 'Technique Polish', time: '10 min', desc: 'Sharpen your best moves', details: ['Your #1 takedown/guard pull (5 reps)', 'Your #1 sweep/pass (5 reps)', 'Your #1 submission (5 reps)', 'Perfect reps only!'] },
      { name: 'Mental Preparation', time: '5 min', desc: 'Get your mind right', details: ['Visualize your game plan', 'Breathing exercises', 'Positive self-talk: "I trained hard, I\'m ready"', 'Remember: win or learn, never lose!'] },
      { name: 'Light Sparring', time: '5 min', desc: 'Easy, technical rounds', details: ['Very light sparring', 'No hard rounds before competition', 'Just stay sharp and confident', 'Save energy for the tournament!'] },
      { name: 'Review & Rest', time: '5 min', desc: 'Final review', details: ['Go over tournament logistics', 'What to bring, what to eat, when to arrive', 'Get a good night\'s sleep!', 'YOU GOT THIS! OSS!'] }
    ]
  },
  { week: 24, phase: 3, title: 'Champion\'s Graduation!', focus: 'Final test & third stripe!',
    moves: ['shrimp', 'bridge', 'takedown-double', 'armbar', 'kimura', 'rear-naked-choke', 'scissor-sweep'],
    segments: [
      { name: 'Warm-Up', time: '5 min', desc: 'Celebration warm-up', details: ['Fun movement games', 'Get excited!'] },
      { name: 'Complete Technique Demo', time: '15 min', desc: 'Show everything you\'ve learned!', details: ['All solo movements', 'All guard techniques', 'All sweeps and passes', 'All submissions', 'All escapes', 'Takedowns and defense', 'YOU KNOW SO MUCH!'] },
      { name: 'Exhibition Match', time: '5 min', desc: 'Show off your skills!', details: ['Full sparring round', 'Use your game plan', 'Show good sportsmanship', 'Have fun with it!'] },
      { name: 'Graduation Ceremony!', time: '5 min', desc: 'Third stripe earned!', details: ['🎉🏆 CONGRATULATIONS! 🏆🎉', 'Three stripes on your belt!', '24 weeks of hard work!', 'You are a TRUE martial artist!', 'OSS! 🥋'] }
    ]
  }
];

const ACHIEVEMENTS = [
  { id: 'first-class', name: 'First Class!', emoji: '🥋', desc: 'Complete your first training session', condition: s => s.totalSessions >= 1 },
  { id: 'five-sessions', name: 'Dedicated Student', emoji: '⭐', desc: 'Complete 5 training sessions', condition: s => s.totalSessions >= 5 },
  { id: 'ten-sessions', name: 'Training Machine', emoji: '🔥', desc: 'Complete 10 training sessions', condition: s => s.totalSessions >= 10 },
  { id: 'twenty-sessions', name: 'Iron Will', emoji: '💪', desc: 'Complete 20 training sessions', condition: s => s.totalSessions >= 20 },
  { id: 'three-streak', name: 'On a Roll', emoji: '🎯', desc: 'Train 3 days in a row', condition: s => s.streak >= 3 },
  { id: 'seven-streak', name: 'Week Warrior', emoji: '🗓️', desc: 'Train 7 days in a row', condition: s => s.streak >= 7 },
  { id: 'five-moves', name: 'Move Collector', emoji: '📚', desc: 'Practice 5 different moves', condition: s => s.movesLearned >= 5 },
  { id: 'ten-moves', name: 'Technique Wizard', emoji: '🧙', desc: 'Practice 10 different moves', condition: s => s.movesLearned >= 10 },
  { id: 'all-moves', name: 'Complete Fighter', emoji: '🏆', desc: 'Practice every move in the library', condition: s => s.movesLearned >= MOVES.length },
  { id: 'first-stripe', name: 'First Stripe!', emoji: '🎗️', desc: 'Earn your first belt stripe', condition: s => s.stripes >= 1 },
  { id: 'second-stripe', name: 'Second Stripe!', emoji: '🎗️', desc: 'Earn your second belt stripe', condition: s => s.stripes >= 2 },
  { id: 'third-stripe', name: 'Third Stripe!', emoji: '🎗️', desc: 'Earn your third belt stripe', condition: s => s.stripes >= 3 },
  { id: 'phase1', name: 'Foundation Complete', emoji: '🏗️', desc: 'Complete all Phase 1 lessons', condition: s => s.completedWeeks.filter(w => w <= 8).length >= 8 },
  { id: 'phase2', name: 'Builder', emoji: '🏛️', desc: 'Complete all Phase 2 lessons', condition: s => s.completedWeeks.filter(w => w > 8 && w <= 16).length >= 8 },
  { id: 'phase3', name: 'Champion!', emoji: '🏆', desc: 'Complete all Phase 3 lessons', condition: s => s.completedWeeks.filter(w => w > 16).length >= 8 },
];

const BELT_PROGRESSION = [
  { name: 'White Belt', color: 'var(--white-belt)', stripes: 0 },
  { name: 'White Belt - 1 Stripe', color: 'var(--white-belt)', stripes: 1 },
  { name: 'White Belt - 2 Stripes', color: 'var(--white-belt)', stripes: 2 },
  { name: 'White Belt - 3 Stripes', color: 'var(--white-belt)', stripes: 3 },
  { name: 'White Belt - 4 Stripes', color: 'var(--white-belt)', stripes: 4 },
  { name: 'Grey Belt', color: 'var(--grey-belt)', stripes: 0 },
];
