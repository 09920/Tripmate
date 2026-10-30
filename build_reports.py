#!/usr/bin/env python3
"""
Master Report Builder for TripMeta
Executes PDF and DOCX document compilers and verifies deliverables.
"""

import os
import sys
import time

def main():
    print("=" * 70)
    print("TripMeta Academic Project Report - Master Build Process")
    print("Academic Year 2026-27 | SPIT, Mumbai")
    print("Authors: Omkar Malode (2024300130) & Yash Bhandare (2024300020)")
    print("Guide: Prof. Rohan Shinde")
    print("=" * 70)

    start_time = time.time()

    # Step 1: Build PDF with two-pass page tracking
    print("\n[Step 1/2] Generating PDF Document (TripMeta_Final_Project_Report.pdf)...")
    import make_pdf
    make_pdf.create_pdf("TripMeta_Final_Project_Report.pdf")

    # Step 2: Build DOCX document
    print("\n[Step 2/2] Generating DOCX Document (TripMeta_Final_Project_Report.docx)...")
    import make_docx
    make_docx.create_docx("TripMeta_Final_Project_Report.docx")

    elapsed = time.time() - start_time

    # Verification
    pdf_path = "TripMeta_Final_Project_Report.pdf"
    docx_path = "TripMeta_Final_Project_Report.docx"

    pdf_size = os.path.getsize(pdf_path) / (1024 * 1024)
    docx_size = os.path.getsize(docx_path) / (1024 * 1024)

    print("\n" + "=" * 70)
    print("BUILD COMPLETE SUCCESSFUL!")
    print(f"Elapsed Time: {elapsed:.2f} seconds")
    print(f"1. PDF Deliverable:  {pdf_path} ({pdf_size:.2f} MB)")
    print(f"2. DOCX Deliverable: {docx_path} ({docx_size:.2f} MB)")
    print("=" * 70)

if __name__ == "__main__":
    main()
