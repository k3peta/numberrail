
import fs from 'fs';

const levels = [
    // Tutorial Level 1
    {
        id: 'T1',
        size: 4,
        hints: [
            { r: 0, c: 0, val: 10 }, { r: 0, c: 1, val: 30 },
            { r: 2, c: 2, val: 10 },
            { r: 3, c: 0, val: 10 }, { r: 3, c: 2, val: 53 }, { r: 3, c: 3, val: 51 }
        ]
    },
    // Tutorial Level 2 (Q1)
    {
        id: 'T2',
        size: 4,
        hints: [
            { r: 0, c: 0, val: 40 }, { r: 0, c: 2, val: 62 },
            { r: 2, c: 1, val: 20 }, { r: 2, c: 2, val: 42 }
        ]
    },
    // Tutorial Level 3 (Q2)
    {
        id: 'T3',
        size: 4,
        hints: [
            { r: 0, c: 0, val: 53 }, { r: 0, c: 2, val: 41 },
            { r: 2, c: 1, val: 20 },
            { r: 3, c: 0, val: 30 }, { r: 3, c: 3, val: 20 }
        ]
    },
    // Tutorial Level 4 (Q3)
    {
        id: 'T4',
        size: 4,
        hints: [
            { r: 0, c: 0, val: 42 }, { r: 0, c: 3, val: 10 },
            { r: 1, c: 3, val: 42 },
            { r: 2, c: 2, val: 31 },
            { r: 3, c: 2, val: 41 }
        ]
    },
    // Tutorial Level 5 (Q4)
    {
        id: 'T5',
        size: 4,
        hints: [
            { r: 1, c: 0, val: 64 }, { r: 1, c: 2, val: 10 },
            { r: 2, c: 3, val: 61 },
            { r: 3, c: 1, val: 31 }
        ]
    },
    // Tutorial Level 6 (Q1 - Part 3)
    {
        id: 'T6',
        size: 4,
        hints: [
            { r: 0, c: 0, val: 10 }, { r: 0, c: 1, val: 53 }, { r: 0, c: 3, val: 10 },
            { r: 1, c: 0, val: 20 },
            { r: 2, c: 0, val: 31 },
            { r: 3, c: 0, val: 10 }, { r: 3, c: 2, val: 20 }, { r: 3, c: 3, val: 10 }
        ]
    },
    // Tutorial Level 7 (Q2 - Part 3)
    {
        id: 'T7',
        size: 4,
        hints: [
            { r: 0, c: 2, val: 41 },
            { r: 1, c: 1, val: 41 }, { r: 1, c: 2, val: 20 },
            { r: 2, c: 0, val: 41 },
            { r: 3, c: 3, val: 20 }
        ]
    },
    // Tutorial Level 8 (Q3 - Part 3)
    {
        id: 'T8',
        size: 4,
        hints: [
            { r: 0, c: 1, val: 20 }, { r: 0, c: 3, val: 20 },
            { r: 1, c: 2, val: 31 },
            { r: 2, c: 0, val: 31 }, { r: 2, c: 1, val: 10 }, { r: 2, c: 2, val: 10 },
            { r: 3, c: 0, val: 20 }, { r: 3, c: 3, val: 20 }
        ]
    },
    // Tutorial Level 9 (Q4 - Part 3)
    {
        id: 'T9',
        size: 4,
        hints: [
            { r: 0, c: 0, val: 20 }, { r: 0, c: 1, val: 41 },
            { r: 1, c: 2, val: 20 },
            { r: 2, c: 2, val: 30 }, { r: 2, c: 3, val: 51 }
        ]
    },
    // Tutorial Level 10 (Q1 - Part 5)
    {
        id: 'T10',
        size: 4,
        hints: [
            { r: 0, c: 0, val: 51 },
            { r: 1, c: 2, val: 31 },
            { r: 2, c: 1, val: 10 },
            { r: 3, c: 1, val: 52 }, { r: 3, c: 3, val: 20 }
        ]
    },
    // Tutorial Level 11 (Q2 - Part 5)
    {
        id: 'T11',
        size: 4,
        hints: [
            { r: 0, c: 1, val: 31 }, { r: 0, c: 3, val: 42 },
            { r: 2, c: 0, val: 51 },
            { r: 3, c: 3, val: 40 }
        ]
    },
    // Tutorial Level 12 (Q3 - Part 5)
    {
        id: 'T12',
        size: 4,
        hints: [
            { r: 2, c: 0, val: 41 }, { r: 2, c: 2, val: 10 },
            { r: 3, c: 0, val: 52 }, { r: 3, c: 2, val: 62 }
        ]
    },
    // Tutorial Level 13 (Q4 - Part 5)
    {
        id: 'T13',
        size: 4,
        hints: [
            { r: 0, c: 0, val: 20 }, { r: 0, c: 3, val: 20 },
            { r: 2, c: 0, val: 52 },
            { r: 3, c: 2, val: 10 }, { r: 3, c: 3, val: 63 }
        ]
    },
    // Q1
    {
        id: 1,
        size: 6,
        hints: [
            { r: 0, c: 0, val: 73 }, { r: 0, c: 5, val: 20 },
            { r: 1, c: 1, val: 10 },
            { r: 2, c: 1, val: 52 }, { r: 2, c: 3, val: 10 },
            { r: 3, c: 5, val: 74 },
            { r: 4, c: 2, val: 10 },
            { r: 5, c: 0, val: 10 }, { r: 5, c: 1, val: 62 }, { r: 5, c: 4, val: 10 }, { r: 5, c: 5, val: 42 }
        ]
    },
    // Q2
    {
        id: 2,
        size: 6,
        hints: [
            { r: 0, c: 0, val: 71 }, { r: 0, c: 5, val: 73 },
            { r: 1, c: 0, val: 53 },
            { r: 4, c: 4, val: 41 },
            { r: 5, c: 1, val: 53 }, { r: 5, c: 5, val: 84 }
        ]
    },
    // Q3
    {
        id: 3,
        size: 6,
        hints: [
            { r: 0, c: 1, val: 64 },
            { r: 1, c: 4, val: 31 },
            { r: 2, c: 2, val: 42 }, { r: 2, c: 3, val: 10 }, { r: 2, c: 5, val: 73 },
            { r: 3, c: 4, val: 20 },
            { r: 4, c: 2, val: 51 },
            { r: 5, c: 1, val: 71 }, { r: 5, c: 5, val: 10 }
        ]
    },
    // Q4
    {
        id: 4,
        size: 6,
        hints: [
            { r: 0, c: 0, val: 10 }, { r: 0, c: 1, val: 73 }, { r: 0, c: 2, val: 41 }, { r: 0, c: 5, val: 30 },
            { r: 1, c: 5, val: 64 },
            { r: 3, c: 5, val: 73 },
            { r: 4, c: 2, val: 63 },
            { r: 5, c: 0, val: 10 }, { r: 5, c: 5, val: 10 }
        ]
    },
    // Q5
    {
        id: 5,
        size: 6,
        hints: [
            { r: 0, c: 0, val: 30 }, { r: 0, c: 1, val: 51 }, { r: 0, c: 2, val: 63 }, { r: 0, c: 4, val: 10 },
            { r: 1, c: 2, val: 10 },
            { r: 2, c: 5, val: 73 },
            { r: 3, c: 1, val: 62 }, { r: 3, c: 3, val: 10 }, { r: 3, c: 5, val: 41 },
            { r: 4, c: 1, val: 10 },
            { r: 5, c: 3, val: 10 }
        ]
    },
    // Q6 (Corrected verified: 40 at r:5 c:2)
    {
        id: 6,
        size: 6,
        hints: [
            { r: 0, c: 3, val: 40 },
            { r: 2, c: 2, val: 74 }, { r: 2, c: 3, val: 74 },
            { r: 3, c: 2, val: 74 }, { r: 3, c: 3, val: 74 },
            { r: 5, c: 2, val: 40 }
        ]
    },
    // Q7
    {
        id: 7,
        size: 6,
        hints: [
            { r: 0, c: 0, val: 64 }, { r: 0, c: 5, val: 31 },
            { r: 1, c: 2, val: 84 },
            { r: 2, c: 2, val: 30 },
            { r: 5, c: 0, val: 83 }, { r: 5, c: 5, val: 84 }
        ]
    },
    // Q8 (Corrected verified: 40, 53 at top left)
    {
        id: 8,
        size: 6,
        hints: [
            { r: 0, c: 0, val: 40 }, { r: 0, c: 1, val: 53 }, { r: 0, c: 5, val: 20 },
            { r: 2, c: 4, val: 73 }, { r: 2, c: 5, val: 51 },
            { r: 4, c: 0, val: 52 },
            { r: 5, c: 4, val: 52 }, { r: 5, c: 5, val: 31 }
        ]
    },
    // Q9 (Corrected verified: 52 at r:3 c:0 & r:4 c:3, top left original)
    {
        id: 9,
        size: 6,
        hints: [
            { r: 0, c: 0, val: 30 }, { r: 0, c: 5, val: 40 },
            { r: 1, c: 1, val: 74 },
            { r: 3, c: 0, val: 52 },
            { r: 4, c: 3, val: 52 }, { r: 4, c: 5, val: 93 },
            { r: 5, c: 3, val: 30 }
        ]
    },
    // Q10
    {
        id: 10,
        size: 6,
        hints: [
            { r: 0, c: 0, val: 30 }, { r: 0, c: 3, val: 72 }, { r: 0, c: 4, val: 72 }, { r: 0, c: 5, val: 20 },
            { r: 3, c: 1, val: 62 }, { r: 3, c: 2, val: 41 },
            { r: 5, c: 0, val: 71 }
        ]
    },
    // Q11
    {
        id: 11,
        size: 6,
        hints: [
            { r: 0, c: 0, val: 30 }, { r: 0, c: 5, val: 74 },
            { r: 1, c: 1, val: 51 }, { r: 1, c: 3, val: 20 },
            { r: 3, c: 1, val: 42 }, { r: 3, c: 4, val: 10 },
            { r: 5, c: 0, val: 52 }, { r: 5, c: 2, val: 83 }, { r: 5, c: 5, val: 10 }
        ]
    },
    // Q12
    {
        id: 12,
        size: 6,
        hints: [
            { r: 0, c: 3, val: 92 },
            { r: 1, c: 1, val: 20 }, { r: 1, c: 3, val: 10 }, { r: 1, c: 4, val: 20 },
            { r: 2, c: 3, val: 52 },
            { r: 4, c: 0, val: 73 },
            { r: 5, c: 0, val: 50 }, { r: 5, c: 5, val: 51 }
        ]
    },
    // Q13
    {
        id: 13,
        size: 6,
        hints: [
            { r: 1, c: 2, val: 41 }, { r: 1, c: 3, val: 52 }, { r: 1, c: 4, val: 52 },
            { r: 2, c: 3, val: 52 },
            { r: 4, c: 2, val: 62 }, { r: 4, c: 3, val: 41 }, { r: 4, c: 4, val: 72 }
        ]
    },
    // Q14
    {
        id: 14,
        size: 6,
        hints: [
            { r: 2, c: 0, val: 51 }, { r: 2, c: 2, val: 41 }, { r: 2, c: 5, val: 51 },
            { r: 3, c: 2, val: 63 }, { r: 3, c: 3, val: 51 },
            { r: 4, c: 1, val: 42 }, { r: 4, c: 3, val: 73 }
        ]
    },
    // Q15
    {
        id: 15,
        size: 6,
        hints: [
            { r: 1, c: 1, val: 63 },
            { r: 2, c: 1, val: 72 }, { r: 2, c: 4, val: 31 },
            { r: 3, c: 0, val: 10 }, { r: 3, c: 1, val: 72 }, { r: 3, c: 4, val: 62 },
            { r: 5, c: 4, val: 61 }
        ]
    },
    // Q16
    {
        id: 16,
        size: 6,
        hints: [
            { r: 0, c: 5, val: 97 },
            { r: 2, c: 2, val: 94 },
            { r: 3, c: 2, val: 95 },
            { r: 5, c: 5, val: 92 }
        ]
    },
    // Q17
    {
        id: 17,
        size: 6,
        hints: [
            { r: 1, c: 3, val: 41 }, { r: 1, c: 4, val: 20 },
            { r: 2, c: 2, val: 53 }, { r: 2, c: 3, val: 51 },
            { r: 3, c: 2, val: 63 }, { r: 3, c: 3, val: 52 },
            { r: 4, c: 2, val: 41 }, { r: 4, c: 3, val: 51 }
        ]
    },
    // Q18
    {
        id: 18,
        size: 6,
        hints: [
            { r: 0, c: 3, val: 42 },
            { r: 1, c: 1, val: 84 }, { r: 1, c: 4, val: 42 },
            { r: 2, c: 2, val: 83 },
            { r: 4, c: 1, val: 42 }, { r: 4, c: 4, val: 85 }
        ]
    },
    // Q19
    {
        id: 19,
        size: 6,
        hints: [
            { r: 0, c: 2, val: 82 },
            { r: 1, c: 2, val: 84 }, { r: 1, c: 5, val: 62 },
            { r: 2, c: 5, val: 51 },
            { r: 4, c: 1, val: 42 }, { r: 4, c: 2, val: 51 }
        ]
    },
    // Q20
    {
        id: 20,
        size: 6,
        hints: [
            { r: 0, c: 0, val: 30 }, { r: 0, c: 5, val: 62 },
            { r: 1, c: 4, val: 10 },
            { r: 2, c: 3, val: 63 },
            { r: 3, c: 2, val: 63 },
            { r: 4, c: 1, val: 51 },
            { r: 5, c: 0, val: 40 }, { r: 5, c: 5, val: 53 }
        ]
    },
    // Q21 (9x9 - Q1)
    {
        id: 21,
        size: 9,
        hints: [
            { r: 0, c: 0, val: 40 }, { r: 0, c: 5, val: 53 }, { r: 0, c: 8, val: 64 },
            { r: 1, c: 0, val: 83 }, { r: 1, c: 5, val: 53 },
            { r: 2, c: 4, val: 83 }, { r: 2, c: 8, val: 61 },
            { r: 3, c: 1, val: 51 }, { r: 3, c: 8, val: 40 },
            { r: 6, c: 6, val: 61 },
            { r: 7, c: 1, val: 73 }, { r: 7, c: 8, val: 72 },
            { r: 8, c: 2, val: 61 }, { r: 8, c: 8, val: 40 }
        ]
    },
    // Q22 (9x9 - Q2)
    {
        id: 22,
        size: 9,
        hints: [
            { r: 1, c: 4, val: 62 }, { r: 1, c: 5, val: 51 },
            { r: 2, c: 4, val: 52 }, { r: 2, c: 7, val: 73 },
            { r: 3, c: 1, val: 94 }, { r: 3, c: 6, val: 72 },
            { r: 4, c: 3, val: 74 },
            { r: 5, c: 3, val: 61 }, { r: 5, c: 4, val: 62 },
            { r: 6, c: 4, val: 41 }, { r: 6, c: 6, val: 73 },
            { r: 7, c: 6, val: 51 },
            { r: 8, c: 0, val: 73 }
        ]
    },
    // Q23 (9x9 - Q3)
    {
        id: 23,
        size: 9,
        hints: [
            { r: 0, c: 1, val: 51 }, { r: 0, c: 2, val: 73 }, { r: 0, c: 7, val: 72 }, { r: 0, c: 8, val: 40 },
            { r: 1, c: 1, val: 51 }, { r: 1, c: 6, val: 31 }, { r: 1, c: 7, val: 62 },
            { r: 3, c: 2, val: 52 }, { r: 3, c: 7, val: 52 },
            { r: 4, c: 0, val: 50 },
            { r: 5, c: 5, val: 50 },
            { r: 6, c: 4, val: 62 }, { r: 6, c: 8, val: 64 },
            { r: 7, c: 5, val: 62 }, { r: 7, c: 8, val: 61 }
        ]
    },
    // Q24 (9x9 - Q4)
    {
        id: 24,
        size: 9,
        hints: [
            { r: 0, c: 3, val: 62 },
            { r: 1, c: 1, val: 50 }, { r: 1, c: 8, val: 51 },
            { r: 2, c: 0, val: 51 }, { r: 2, c: 8, val: 50 },
            { r: 3, c: 0, val: 61 }, { r: 3, c: 4, val: 64 }, { r: 3, c: 5, val: 51 },
            { r: 4, c: 3, val: 72 }, { r: 4, c: 6, val: 61 },
            { r: 5, c: 4, val: 61 },
            { r: 6, c: 3, val: 42 }, { r: 6, c: 4, val: 73 },
            { r: 7, c: 0, val: 75 },
            { r: 8, c: 8, val: 40 }
        ]
    },
    // Q25 (9x9 - Q5)
    {
        id: 25,
        size: 9,
        hints: [
            { r: 0, c: 1, val: 40 }, { r: 0, c: 8, val: 40 },
            { r: 1, c: 3, val: 60 },
            { r: 2, c: 8, val: 51 },
            { r: 3, c: 0, val: 40 }, { r: 3, c: 2, val: 61 }, { r: 3, c: 4, val: 52 }, { r: 3, c: 7, val: 72 },
            { r: 4, c: 2, val: 52 }, { r: 4, c: 4, val: 62 },
            { r: 6, c: 0, val: 52 }, { r: 6, c: 3, val: 52 },
            { r: 7, c: 3, val: 52 }, { r: 7, c: 8, val: 50 },
            { r: 8, c: 3, val: 52 }, { r: 8, c: 8, val: 42 }
        ]
    },
    // Q26 (9x9 - Q6)
    {
        id: 26,
        size: 9,
        hints: [
            { r: 0, c: 3, val: 62 }, { r: 0, c: 4, val: 62 }, { r: 0, c: 8, val: 30 },
            { r: 1, c: 4, val: 60 },
            { r: 2, c: 8, val: 62 },
            { r: 3, c: 3, val: 61 },
            { r: 4, c: 1, val: 61 }, { r: 4, c: 2, val: 62 },
            { r: 5, c: 0, val: 61 }, { r: 5, c: 5, val: 61 }, { r: 5, c: 8, val: 61 },
            { r: 6, c: 5, val: 62 },
            { r: 7, c: 7, val: 62 },
            { r: 8, c: 1, val: 62 }
        ]
    },
    // Q27 (9x9 - Q7)
    {
        id: 27,
        size: 9,
        hints: [
            { r: 0, c: 0, val: 50 }, { r: 0, c: 6, val: 51 },
            { r: 1, c: 1, val: 62 }, { r: 1, c: 4, val: 51 },
            { r: 3, c: 8, val: 40 },
            { r: 4, c: 3, val: 40 }, { r: 4, c: 4, val: 52 }, { r: 4, c: 5, val: 61 },
            { r: 5, c: 0, val: 51 }, { r: 5, c: 7, val: 61 }, { r: 5, c: 8, val: 71 },
            { r: 7, c: 1, val: 52 },
            { r: 8, c: 8, val: 40 }
        ]
    },
    // Q28 (9x9 - Q8)
    {
        id: 28,
        size: 9,
        hints: [
            { r: 0, c: 4, val: 50 },
            { r: 1, c: 3, val: 41 }, { r: 1, c: 5, val: 42 },
            { r: 2, c: 2, val: 42 }, { r: 2, c: 6, val: 41 },
            { r: 3, c: 1, val: 82 }, { r: 3, c: 7, val: 42 },
            { r: 4, c: 0, val: 61 }, { r: 4, c: 8, val: 41 },
            { r: 5, c: 1, val: 41 }, { r: 5, c: 7, val: 64 },
            { r: 6, c: 2, val: 41 }, { r: 6, c: 6, val: 62 },
            { r: 7, c: 3, val: 82 }, { r: 7, c: 5, val: 42 },
            { r: 8, c: 4, val: 61 }
        ]
    },
    // Q29 (9x9 - Q9)
    {
        id: 29,
        size: 9,
        hints: [
            { r: 0, c: 0, val: 30 }, { r: 0, c: 4, val: 83 }, { r: 0, c: 8, val: 83 },
            { r: 2, c: 4, val: 83 },
            { r: 4, c: 0, val: 83 }, { r: 4, c: 2, val: 61 }, { r: 4, c: 4, val: 62 }, { r: 4, c: 6, val: 62 }, { r: 4, c: 8, val: 40 },
            { r: 6, c: 4, val: 61 },
            { r: 8, c: 0, val: 82 }, { r: 8, c: 4, val: 64 }, { r: 8, c: 8, val: 40 }
        ]
    },
    // Q30 (9x9 - Q10)
    {
        id: 30,
        size: 9,
        hints: [
            { r: 0, c: 4, val: 50 },
            { r: 1, c: 2, val: 51 }, { r: 1, c: 6, val: 84 },
            { r: 2, c: 1, val: 52 }, { r: 2, c: 7, val: 62 },
            { r: 4, c: 0, val: 73 }, { r: 4, c: 4, val: 83 }, { r: 4, c: 8, val: 72 },
            { r: 6, c: 1, val: 62 }, { r: 6, c: 7, val: 61 },
            { r: 7, c: 2, val: 63 }, { r: 7, c: 6, val: 51 },
            { r: 8, c: 4, val: 72 }
        ]
    }
];

function countTurns(cells) {
    if (cells.length < 3) return 0;
    let turns = 0;
    for (let i = 2; i < cells.length; i++) {
        const prev = cells[i - 2];
        const curr = cells[i - 1];
        const next = cells[i];
        if (prev.r !== next.r && prev.c !== next.c) {
            turns++;
        }
    }
    return turns;
}

function solveSingleLevel(level) {
    const { size, hints, id } = level;
    let grid = Array(size).fill().map(() => Array(size).fill(null));
    let paths = hints.map((h, i) => ({
        id: i,
        targetLen: Math.floor(h.val / 10),
        targetTurns: h.val % 10,
        cells: [{ r: h.r, c: h.c }]
    }));

    // Mark starts
    hints.forEach((h, i) => {
        grid[h.r][h.c] = i;
    });

    const startTime = Date.now();
    const timeout = 5000; // Increased timeout

    function solveRecursive(pathIdx) {
        if (Date.now() - startTime > timeout) throw new Error('Timeout');

        if (pathIdx >= paths.length) {
            // Check if all grid is filled
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (grid[r][c] === null) return false;
                }
            }
            return true;
        }

        const path = paths[pathIdx];
        const currentLen = path.cells.length;

        if (currentLen === path.targetLen) {
            if (countTurns(path.cells) === path.targetTurns) {
                return solveRecursive(pathIdx + 1);
            } else {
                return false;
            }
        }

        const head = path.cells[currentLen - 1];
        const siblings = [
            { r: head.r - 1, c: head.c },
            { r: head.r + 1, c: head.c },
            { r: head.r, c: head.c - 1 },
            { r: head.r, c: head.c + 1 }
        ];

        for (const next of siblings) {
            if (next.r < 0 || next.r >= size || next.c < 0 || next.c >= size) continue;
            if (grid[next.r][next.c] !== null) continue;

            const potentialPath = [...path.cells, next];
            if (countTurns(potentialPath) > path.targetTurns) continue;

            grid[next.r][next.c] = path.id;
            path.cells.push(next);

            if (solveRecursive(pathIdx)) return true;

            path.cells.pop();
            grid[next.r][next.c] = null;
        }
        return false;
    }

    try {
        if (solveRecursive(0)) {
            return { status: 'Solvable', time: Date.now() - startTime };
        } else {
            return { status: 'Unsolvable', time: Date.now() - startTime };
        }
    } catch (e) {
        if (e.message === 'Timeout') return { status: 'Timeout', time: timeout };
        throw e;
    }
}

console.log('Verifying all levels...');
fs.writeFileSync('verify_log.txt', 'Verifying all levels...\n');

levels.forEach((level, i) => {
    // Calculate size index for better display
    let sizeIndex = 1;
    for (let k = 0; k < i; k++) {
        if (levels[k].size === level.size) sizeIndex++;
    }
    const displayName = `${level.size}-${sizeIndex} (id:${level.id})`;

    const result = solveSingleLevel(level);
    const msg = `Level ${displayName}: ${result.status} (${result.time}ms)\n`;
    console.log(msg.trim());
    fs.appendFileSync('verify_log.txt', msg);
});
console.log('Done.');
