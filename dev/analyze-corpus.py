#!/usr/bin/env python3
"""
Batch analysis script for AI Detection corpus
Runs the SmartWriter AI Detection algorithm on all corpus texts
"""

import os
import json
import csv
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

class CorpusAnalyzer:
    """Analyze AI detection corpus and compile results"""
    
    def __init__(self, corpus_dir: str = "dev/corpus-ai-detection"):
        self.corpus_dir = Path(corpus_dir)
        self.generated_dir = self.corpus_dir / "generated"
        self.human_dir = self.corpus_dir / "human"
        self.results_dir = self.corpus_dir / "analysis-results"
        self.metadata_file = self.corpus_dir / "metadata.csv"
        
    def get_all_texts(self) -> List[Tuple[Path, str]]:
        """Get all text files with their labels"""
        texts = []
        
        # Get generated texts
        if self.generated_dir.exists():
            for txt_file in self.generated_dir.rglob("*.md"):
                texts.append((txt_file, "GENERATED"))
        
        # Get human texts
        if self.human_dir.exists():
            for txt_file in self.human_dir.rglob("*.md"):
                texts.append((txt_file, "HUMAN"))
        
        return sorted(texts)
    
    def read_text_content(self, filepath: Path) -> str:
        """Extract text content from markdown file"""
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract text after "## Generated Text" or "## Text" header
        sections = content.split('\n## ')
        
        for section in sections:
            if section.startswith('Generated Text') or section.startswith('Text'):
                lines = section.split('\n')[1:]  # Skip header
                return '\n'.join(lines).strip()
        
        return content
    
    def analyze_text(self, text: str, filepath: Path) -> Dict:
        """
        Run AI detection analysis on text
        NOTE: This is a placeholder - integrate with actual SmartWriter analyzer
        """
        # TODO: Integrate with src/analyzers/ai-detection.ts
        # For now, return template structure
        
        result = {
            "file": filepath.name,
            "path": str(filepath),
            "word_count": len(text.split()),
            "timestamp": datetime.now().isoformat(),
            "analysis": {
                "detected_as_ai": None,
                "confidence": None,
                "indicators": [],
                "details": {}
            }
        }
        
        return result
    
    def process_corpus(self, output_file: str = None) -> List[Dict]:
        """Process all corpus texts"""
        texts = self.get_all_texts()
        results = []
        
        print(f"📊 Processing {len(texts)} texts...")
        
        for i, (filepath, label) in enumerate(texts, 1):
            print(f"  [{i}/{len(texts)}] {filepath.name}...", end=" ")
            
            try:
                # Read text
                text_content = self.read_text_content(filepath)
                
                # Analyze
                result = self.analyze_text(text_content, filepath)
                result["actual_label"] = label
                
                results.append(result)
                print("✅")
                
            except Exception as e:
                print(f"❌ Error: {e}")
        
        # Save results
        if output_file:
            with open(output_file, 'w') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"\n✅ Results saved to: {output_file}")
        
        return results
    
    def compile_metrics(self, results: List[Dict]) -> Dict:
        """Compile accuracy metrics from results"""
        metrics = {
            "total_texts": len(results),
            "generated_texts": 0,
            "human_texts": 0,
            "true_positives": 0,    # Generated, detected as AI
            "true_negatives": 0,    # Human, detected as Human
            "false_positives": 0,   # Human, detected as AI
            "false_negatives": 0,   # Generated, detected as Human
            "accuracy": 0.0,
            "precision": 0.0,
            "recall": 0.0,
            "f1_score": 0.0,
        }
        
        if not results:
            return metrics
        
        for result in results:
            label = result["actual_label"]
            detected_as_ai = result["analysis"]["detected_as_ai"]
            
            if label == "GENERATED":
                metrics["generated_texts"] += 1
                if detected_as_ai:
                    metrics["true_positives"] += 1
                else:
                    metrics["false_negatives"] += 1
            else:  # HUMAN
                metrics["human_texts"] += 1
                if not detected_as_ai:
                    metrics["true_negatives"] += 1
                else:
                    metrics["false_positives"] += 1
        
        # Calculate metrics
        total_correct = metrics["true_positives"] + metrics["true_negatives"]
        metrics["accuracy"] = total_correct / metrics["total_texts"] if metrics["total_texts"] > 0 else 0
        
        if (metrics["true_positives"] + metrics["false_positives"]) > 0:
            metrics["precision"] = metrics["true_positives"] / (metrics["true_positives"] + metrics["false_positives"])
        
        if (metrics["true_positives"] + metrics["false_negatives"]) > 0:
            metrics["recall"] = metrics["true_positives"] / (metrics["true_positives"] + metrics["false_negatives"])
        
        if (metrics["precision"] + metrics["recall"]) > 0:
            metrics["f1_score"] = 2 * (metrics["precision"] * metrics["recall"]) / (metrics["precision"] + metrics["recall"])
        
        return metrics
    
    def generate_report(self, results: List[Dict], output_file: str = "analysis-results/report.md"):
        """Generate markdown report of findings"""
        metrics = self.compile_metrics(results)
        
        report = f"""# AI Detection Corpus Analysis Report

**Analysis Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary Statistics

- **Total Texts Analyzed**: {metrics['total_texts']}
- **Generated Texts**: {metrics['generated_texts']}
- **Human Texts**: {metrics['human_texts']}

## Detection Performance

### Accuracy Metrics
- **Accuracy**: {metrics['accuracy']:.2%}
- **Precision**: {metrics['precision']:.2%}
- **Recall**: {metrics['recall']:.2%}
- **F1-Score**: {metrics['f1_score']:.2%}

### Confusion Matrix
```
                Detected as AI    Detected as Human
Generated       {metrics['true_positives']:3d} (TP)             {metrics['false_negatives']:3d} (FN)
Human           {metrics['false_positives']:3d} (FP)             {metrics['true_negatives']:3d} (TN)
```

## Detailed Results

### True Positives (Generated texts correctly detected)
| File | Confidence |
|------|------------|
"""
        
        for result in results:
            if (result["actual_label"] == "GENERATED" and 
                result["analysis"]["detected_as_ai"]):
                confidence = result["analysis"]["confidence"]
                report += f"| {result['file']} | {confidence:.2%} |\n"
        
        report += """
### False Positives (Human texts incorrectly detected as AI)
| File | Confidence | Reason |
|------|------------|--------|
"""
        
        for result in results:
            if (result["actual_label"] == "HUMAN" and 
                result["analysis"]["detected_as_ai"]):
                confidence = result["analysis"]["confidence"]
                report += f"| {result['file']} | {confidence:.2%} | [Investigate] |\n"
        
        report += """
### False Negatives (Generated texts NOT detected)
| File | Confidence | Model |
|------|------------|-------|
"""
        
        for result in results:
            if (result["actual_label"] == "GENERATED" and 
                not result["analysis"]["detected_as_ai"]):
                confidence = result["analysis"]["confidence"]
                report += f"| {result['file']} | {confidence:.2%} | [Model] |\n"
        
        report += f"""

## Recommendations

1. **High False Positive Rate**: Review detection rules for:
   - Technical texts
   - Edited human texts
   - Academic writing style

2. **High False Negative Rate**: Improve detection for:
   - [Specific AI models that evade detection]
   - [Specific writing styles]

3. **Confidence Calibration**: 
   - Current threshold: [X]
   - Recommended threshold: [Y]

## Next Steps

1. Collect more edge-case texts
2. Refine detection algorithm based on findings
3. Test with different confidence thresholds
4. Validate with independent corpus

---
**Generated by**: SmartWriter Analyzer
"""
        
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"✅ Report saved to: {output_path}")
        
        return report


def main():
    parser = argparse.ArgumentParser(
        description="Analyze AI Detection corpus and compile results"
    )
    parser.add_argument(
        "--corpus-dir",
        default="dev/corpus-ai-detection",
        help="Path to corpus directory"
    )
    parser.add_argument(
        "--output",
        default="corpus-ai-detection/analysis-results/results.json",
        help="Output file for results JSON"
    )
    parser.add_argument(
        "--report",
        default="corpus-ai-detection/analysis-results/report.md",
        help="Output file for markdown report"
    )
    
    args = parser.parse_args()
    
    analyzer = CorpusAnalyzer(args.corpus_dir)
    
    print("🔍 AI Detection Corpus Analyzer")
    print("=" * 50)
    
    # Get all texts
    texts = analyzer.get_all_texts()
    print(f"📁 Found {len(texts)} text files")
    
    if not texts:
        print("❌ No text files found in corpus directory!")
        return
    
    # Process corpus
    results = analyzer.process_corpus(args.output)
    
    # Compile metrics
    metrics = analyzer.compile_metrics(results)
    print("\n📊 Analysis Results:")
    print(f"  Accuracy: {metrics['accuracy']:.2%}")
    print(f"  Precision: {metrics['precision']:.2%}")
    print(f"  Recall: {metrics['recall']:.2%}")
    print(f"  F1-Score: {metrics['f1_score']:.2%}")
    
    # Generate report
    analyzer.generate_report(results, args.report)


if __name__ == "__main__":
    main()
