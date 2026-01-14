# AI Detection Corpus

Corpus of ~40 texts for training and validating AI text detection algorithm.

## Structure

```
corpus-ai-detection/
├── generated/          # Texts known to be AI-generated (20)
│   ├── chatgpt-3.5/   (8)
│   ├── chatgpt-4/     (4)
│   ├── claude/        (4)
│   ├── gemini/        (2)
│   └── meta/          (2)
├── human/             # Texts known to be human-written (20)
│   ├── published/     (5) - Classics and published literature
│   ├── indie/         (5) - Self-published authors
│   ├── technical/     (5) - Technical articles and essays
│   └── diverse/       (5) - Reviews, blogs, misc
├── PROMPTS.md         # Exact prompts used for generation
├── metadata.csv       # Metadata for all texts
├── analysis-results/  # DETECT-AI analysis results
└── README.md          # This file
```

## Usage

1. **Generation Phase** (Week 1-2)
   - Use PROMPTS.md to generate texts with AI models
   - Collect human texts from sources listed
   - Save each with appropriate template
   - Update metadata.csv

2. **Analysis Phase** (Week 3)
   - Run AI Detection algorithm on all texts
   - Store results in analysis-results/
   - Compile accuracy metrics

3. **Validation Phase** (Week 4)
   - Analyze false positives/negatives
   - Calibrate confidence thresholds
   - Document findings

## Status

- [ ] Directory structure created
- [ ] Templates ready
- [ ] Prompts documented
- [ ] AI texts generated (0/20)
- [ ] Human texts collected (0/20)
- [ ] Analysis completed
- [ ] Results compiled
- [ ] Documentation finalized

## Notes

- Keep texts 300-500 words each for consistency
- Document all sources and permissions
- Store analysis results as JSON
- Do not commit full corpus to public GitHub (privacy/licensing)
