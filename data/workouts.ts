export interface Exercise {
  name: string;
  sets: number;
  reps: number | string;
  muscle: string;
  equipment: string;
  gifUrl?: string;
}

export interface MuscleGroup {
  name: string;
  exercises: Exercise[];
  recommended?: Exercise[];
}

export interface WorkoutDay {
  day: string;
  shortDay: string;
  focus: string;
  muscleGroups: MuscleGroup[];
}

export const WEEKLY_WORKOUTS: WorkoutDay[] = [
  {
    day: 'Monday',
    shortDay: 'MON',
    focus: 'Chest • Shoulders • Biceps',
    muscleGroups: [
      {
        name: 'CHEST',
        exercises: [
          { name: 'Inclined Dumbbell Press', sets: 3, reps: 12, muscle: 'Upper Chest', equipment: 'Dumbbells + Incline Bench', gifUrl: '/gifs/incline-dumbbell-press.gif' },
          { name: 'Push Ups', sets: 5, reps: 10, muscle: 'Chest', equipment: 'Bodyweight', gifUrl: '/gifs/push-up.gif' },
          { name: 'Flat Bench Press', sets: 3, reps: 12, muscle: 'Mid Chest', equipment: 'Barbell + Flat Bench', gifUrl: '/gifs/barbell-bench-press.gif' },
        ],
        recommended: [
          { name: 'Cable Crossover', sets: 3, reps: 15, muscle: 'Inner Chest', equipment: 'Cable Machine', gifUrl: '/gifs/cable-crossover.gif' },
          { name: 'Chest Dips', sets: 3, reps: 12, muscle: 'Lower Chest', equipment: 'Dip Station', gifUrl: '/gifs/close-grip-bench-press.gif' },
        ]
      },
      {
        name: 'SHOULDERS',
        exercises: [
          { name: 'DB Lateral Raises (7.5 kg)', sets: 3, reps: 15, muscle: 'Side Delts', equipment: 'Dumbbells', gifUrl: '/gifs/dumbbell-lateral-raise.gif' },
          { name: 'Shoulder Press', sets: 3, reps: 12, muscle: 'Front Delts', equipment: 'Dumbbells', gifUrl: '/gifs/dumbbell-shoulder-press.gif' },
          { name: 'Rear Delt DB Flyes', sets: 3, reps: 15, muscle: 'Rear Delts', equipment: 'Dumbbells', gifUrl: '/gifs/dumbbell-lateral-raise.gif' },
        ],
        recommended: [
          { name: 'Arnold Press', sets: 3, reps: 10, muscle: 'Full Shoulders', equipment: 'Dumbbells', gifUrl: '/gifs/arnold-press.gif' },
          { name: 'Face Pulls', sets: 3, reps: 15, muscle: 'Rear Delts', equipment: 'Cable Machine', gifUrl: '/gifs/face-pull.gif' },
        ]
      },
      {
        name: 'BICEPS',
        exercises: [
          { name: 'Seated Bicep Curls', sets: 3, reps: 12, muscle: 'Biceps', equipment: 'Dumbbells + Bench', gifUrl: '/gifs/concentration-curl.gif' },
          { name: 'Concentration Curls', sets: 3, reps: 12, muscle: 'Bicep Peak', equipment: 'Dumbbell', gifUrl: '/gifs/concentration-curl.gif' },
          { name: 'Hammer Curls', sets: 3, reps: 12, muscle: 'Brachialis', equipment: 'Dumbbells', gifUrl: '/gifs/hammer-curl.gif' },
        ],
        recommended: [
          { name: 'Barbell Curl', sets: 3, reps: 10, muscle: 'Biceps', equipment: 'Barbell', gifUrl: '/gifs/barbell-curl.gif' },
          { name: 'Preacher Curl', sets: 3, reps: 12, muscle: 'Lower Bicep', equipment: 'EZ Bar + Preacher', gifUrl: '/gifs/barbell-curl.gif' },
        ]
      },
    ]
  },
  {
    day: 'Tuesday',
    shortDay: 'TUE',
    focus: 'Legs • Abs',
    muscleGroups: [
      {
        name: 'LEGS (QUADS)',
        exercises: [
          { name: 'Barbell Squats', sets: 4, reps: 10, muscle: 'Quads', equipment: 'Barbell + Squat Rack', gifUrl: '/gifs/barbell-squat.gif' },
          { name: 'Leg Press', sets: 3, reps: 12, muscle: 'Quads', equipment: 'Leg Press Machine', gifUrl: '/gifs/barbell-squat.gif' },
        ],
        recommended: [
          { name: 'Bulgarian Split Squats', sets: 3, reps: 10, muscle: 'Quads + Glutes', equipment: 'Dumbbells + Bench', gifUrl: '/gifs/barbell-squat.gif' },
          { name: 'Leg Extension', sets: 3, reps: 15, muscle: 'Quads', equipment: 'Machine', gifUrl: '/gifs/leg-extension.gif' },
        ]
      },
      {
        name: 'LEGS (HAMSTRINGS)',
        exercises: [
          { name: 'Romanian Deadlift', sets: 3, reps: 12, muscle: 'Hamstrings', equipment: 'Barbell/Dumbbells', gifUrl: '/gifs/barbell-romanian-deadlift.gif' },
        ],
        recommended: [
          { name: 'Leg Curl', sets: 3, reps: 15, muscle: 'Hamstrings', equipment: 'Machine', gifUrl: '/gifs/leg-curl.gif' },
        ]
      },
      {
        name: 'CALVES',
        exercises: [
          { name: 'Standing Calf Raises', sets: 4, reps: 15, muscle: 'Calves', equipment: 'Machine/Bodyweight', gifUrl: '/gifs/barbell-squat.gif' },
        ],
        recommended: [
          { name: 'Seated Calf Raise', sets: 3, reps: 20, muscle: 'Soleus', equipment: 'Machine', gifUrl: '/gifs/barbell-squat.gif' },
        ]
      },
      {
        name: 'ABS',
        exercises: [
          { name: 'Hanging Leg Raises', sets: 3, reps: 15, muscle: 'Lower Abs', equipment: 'Pull-Up Bar', gifUrl: '/gifs/bicycle-crunch.gif' },
          { name: 'Bicycle Crunches', sets: 3, reps: 20, muscle: 'Obliques', equipment: 'Bodyweight', gifUrl: '/gifs/bicycle-crunch.gif' },
          { name: 'Plank', sets: 3, reps: '60s', muscle: 'Core', equipment: 'Bodyweight', gifUrl: '/gifs/ab-wheel-rollout.gif' },
        ],
        recommended: [
          { name: 'Cable Crunch', sets: 3, reps: 15, muscle: 'Upper Abs', equipment: 'Cable Machine', gifUrl: '/gifs/bicycle-crunch.gif' },
          { name: 'Ab Wheel Rollout', sets: 3, reps: 10, muscle: 'Full Core', equipment: 'Ab Wheel', gifUrl: '/gifs/ab-wheel-rollout.gif' },
        ]
      },
    ]
  },
  {
    day: 'Wednesday',
    shortDay: 'WED',
    focus: 'Back • Triceps',
    muscleGroups: [
      {
        name: 'BACK',
        exercises: [
          { name: 'Dumbbell Row', sets: 3, reps: 12, muscle: 'Lats', equipment: 'Dumbbell + Bench', gifUrl: '/gifs/dumbbell-row.gif' },
          { name: 'Pull Ups', sets: 4, reps: '8-10', muscle: 'Lats + Back', equipment: 'Pull-Up Bar', gifUrl: '/gifs/pull-up.gif' },
          { name: 'Rear Delt Flyes', sets: 3, reps: 15, muscle: 'Rear Delts', equipment: 'Dumbbells', gifUrl: '/gifs/dumbbell-lateral-raise.gif' },
          { name: 'Upper Back Row', sets: 3, reps: 12, muscle: 'Upper Back', equipment: 'Cable/Barbell', gifUrl: '/gifs/seated-cable-row.gif' },
        ],
        recommended: [
          { name: 'Lat Pulldown', sets: 3, reps: 12, muscle: 'Lats', equipment: 'Cable Machine', gifUrl: '/gifs/lat-pulldown.gif' },
          { name: 'T-Bar Row', sets: 3, reps: 10, muscle: 'Mid Back', equipment: 'T-Bar', gifUrl: '/gifs/barbell-bent-over-row.gif' },
        ]
      },
      {
        name: 'TRICEPS',
        exercises: [
          { name: 'Overhead DB Extensions', sets: 3, reps: 12, muscle: 'Long Head', equipment: 'Dumbbell', gifUrl: '/gifs/pushdown.gif' },
          { name: 'DB Kickbacks', sets: 3, reps: 12, muscle: 'Lateral Head', equipment: 'Dumbbell', gifUrl: '/gifs/rope-pushdown.gif' },
          { name: 'Skull Crushers', sets: 3, reps: 12, muscle: 'Triceps', equipment: 'EZ Bar + Bench', gifUrl: '/gifs/close-grip-bench-press.gif' },
          { name: 'Close Grip Bench Press', sets: 3, reps: 10, muscle: 'Triceps + Chest', equipment: 'Barbell + Bench', gifUrl: '/gifs/close-grip-bench-press.gif' },
        ],
        recommended: [
          { name: 'Rope Pushdowns', sets: 3, reps: 15, muscle: 'Triceps', equipment: 'Cable Machine', gifUrl: '/gifs/pushdown.gif' },
          { name: 'Dips', sets: 3, reps: 10, muscle: 'Triceps', equipment: 'Dip Station', gifUrl: '/gifs/close-grip-bench-press.gif' },
        ]
      },
    ]
  },
  {
    day: 'Thursday',
    shortDay: 'THU',
    focus: 'Triceps • Biceps • Forearms',
    muscleGroups: [
      {
        name: 'TRICEPS',
        exercises: [
          { name: 'Rope Pushdowns', sets: 3, reps: 15, muscle: 'Triceps', equipment: 'Cable Machine', gifUrl: '/gifs/pushdown.gif' },
          { name: 'Overhead Cable Extension', sets: 3, reps: 12, muscle: 'Long Head', equipment: 'Cable Machine', gifUrl: '/gifs/rope-pushdown.gif' },
          { name: 'Diamond Push Ups', sets: 3, reps: 10, muscle: 'Triceps', equipment: 'Bodyweight', gifUrl: '/gifs/push-up.gif' },
        ],
        recommended: [
          { name: 'Bench Dips', sets: 3, reps: 15, muscle: 'Triceps', equipment: 'Bench', gifUrl: '/gifs/close-grip-bench-press.gif' },
        ]
      },
      {
        name: 'BICEPS',
        exercises: [
          { name: 'EZ Bar Curls', sets: 3, reps: 12, muscle: 'Biceps', equipment: 'EZ Bar', gifUrl: '/gifs/barbell-curl.gif' },
          { name: 'Incline DB Curls', sets: 3, reps: 12, muscle: 'Long Head', equipment: 'Dumbbells + Incline Bench', gifUrl: '/gifs/concentration-curl.gif' },
          { name: 'Spider Curls', sets: 3, reps: 10, muscle: 'Short Head', equipment: 'EZ Bar + Incline Bench', gifUrl: '/gifs/concentration-curl.gif' },
        ],
        recommended: [
          { name: 'Cable Curl', sets: 3, reps: 15, muscle: 'Biceps', equipment: 'Cable Machine', gifUrl: '/gifs/barbell-curl.gif' },
        ]
      },
      {
        name: 'FOREARMS',
        exercises: [
          { name: 'Wrist Curls', sets: 3, reps: 20, muscle: 'Forearm Flexors', equipment: 'Barbell/Dumbbells', gifUrl: '/gifs/reverse-wrist-curl.gif' },
          { name: 'Reverse Wrist Curls', sets: 3, reps: 20, muscle: 'Forearm Extensors', equipment: 'Barbell/Dumbbells', gifUrl: '/gifs/reverse-wrist-curl.gif' },
          { name: 'Farmers Walk', sets: 3, reps: '30s', muscle: 'Grip Strength', equipment: 'Heavy Dumbbells', gifUrl: '/gifs/barbell-romanian-deadlift.gif' },
        ],
        recommended: [
          { name: 'Dead Hangs', sets: 3, reps: '30s', muscle: 'Grip', equipment: 'Pull-Up Bar', gifUrl: '/gifs/pull-up.gif' },
        ]
      },
    ]
  },
  {
    day: 'Friday',
    shortDay: 'FRI',
    focus: 'Chest • Back • Traps',
    muscleGroups: [
      {
        name: 'CHEST',
        exercises: [
          { name: 'Flat Bench Press', sets: 4, reps: 10, muscle: 'Mid Chest', equipment: 'Barbell + Bench', gifUrl: '/gifs/barbell-bench-press.gif' },
          { name: 'Incline DB Flyes', sets: 3, reps: 12, muscle: 'Upper Chest', equipment: 'Dumbbells + Incline Bench', gifUrl: '/gifs/incline-dumbbell-press.gif' },
          { name: 'Decline Push Ups', sets: 3, reps: 15, muscle: 'Lower Chest', equipment: 'Bodyweight + Bench', gifUrl: '/gifs/push-up.gif' },
        ],
        recommended: [
          { name: 'Pec Deck Fly', sets: 3, reps: 12, muscle: 'Inner Chest', equipment: 'Machine', gifUrl: '/gifs/pec-deck-fly.gif' },
        ]
      },
      {
        name: 'BACK',
        exercises: [
          { name: 'Barbell Row', sets: 4, reps: 10, muscle: 'Mid Back', equipment: 'Barbell', gifUrl: '/gifs/barbell-bent-over-row.gif' },
          { name: 'Lat Pulldown', sets: 3, reps: 12, muscle: 'Lats', equipment: 'Cable Machine', gifUrl: '/gifs/lat-pulldown.gif' },
          { name: 'Seated Cable Row', sets: 3, reps: 12, muscle: 'Mid Back', equipment: 'Cable Machine', gifUrl: '/gifs/seated-cable-row.gif' },
        ],
        recommended: [
          { name: 'Chin Ups', sets: 3, reps: 8, muscle: 'Lats + Biceps', equipment: 'Pull-Up Bar', gifUrl: '/gifs/pull-up.gif' },
        ]
      },
      {
        name: 'TRAPS',
        exercises: [
          { name: 'Barbell Shrugs', sets: 4, reps: 15, muscle: 'Upper Traps', equipment: 'Barbell', gifUrl: '/gifs/barbell-shrug.gif' },
          { name: 'DB Shrugs', sets: 3, reps: 15, muscle: 'Traps', equipment: 'Dumbbells', gifUrl: '/gifs/barbell-shrug.gif' },
        ],
        recommended: [
          { name: 'Face Pulls', sets: 3, reps: 15, muscle: 'Mid Traps + Rear Delts', equipment: 'Cable Machine', gifUrl: '/gifs/face-pull.gif' },
          { name: 'Upright Row', sets: 3, reps: 12, muscle: 'Traps + Delts', equipment: 'Barbell', gifUrl: '/gifs/barbell-upright-row.gif' },
        ]
      },
    ]
  },
];
