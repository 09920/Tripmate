import os
import sys
from PIL import Image as PILImage

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether, HRFlowable, Flowable
)
from reportlab.pdfgen import canvas

import report_content as rc

def to_roman(n):
    val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    syb = ["m", "cm", "d", "cd", "c", "xc", "l", "xl", "x", "ix", "v", "iv", "i"]
    roman_num = ''
    i = 0
    while n > 0:
        for _ in range(n // val[i]):
            roman_num += syb[i]
            n -= val[i]
        i += 1
    return roman_num

# Global dictionary to store page bookmarks from pass 1
GLOBAL_PAGE_MAP = {}
GLOBAL_CH1_START = 10

class PageTracker(Flowable):
    def __init__(self, key):
        super().__init__()
        self.key = key
        self.width = 0
        self.height = 0

    def draw(self):
        GLOBAL_PAGE_MAP[self.key] = self.canv._pageNumber

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        ch1_pg = GLOBAL_PAGE_MAP.get("Chapter 1: Introduction and Problem Definition", GLOBAL_CH1_START)
        arabic_total = num_pages - ch1_pg + 1

        for state in self._saved_page_states:
            self.__dict__.update(state)
            current_pg = self._pageNumber
            
            if current_pg > 1: # Suppress headers/footers on cover page
                self.saveState()
                
                # Header (Only on Chapter / Content pages, or subtle on prelims)
                if current_pg >= ch1_pg:
                    self.setFont("Helvetica-Bold", 8)
                    self.setFillColor(colors.HexColor("#1E3A8A"))
                    self.drawString(54, 804, "TripMeta — Intelligent Travel Recommendation Platform")
                    self.setFont("Helvetica", 8)
                    self.setFillColor(colors.HexColor("#64748B"))
                    self.drawRightString(541, 804, "SPIT | AY 2026–27")
                    
                    self.setStrokeColor(colors.HexColor("#CBD5E1"))
                    self.setLineWidth(0.6)
                    self.line(54, 798, 541, 798)
                
                # Footer Line
                self.setStrokeColor(colors.HexColor("#E2E8F0"))
                self.setLineWidth(0.6)
                self.line(54, 46, 541, 46)
                
                # Footer Text
                self.setFont("Helvetica", 8)
                self.setFillColor(colors.HexColor("#64748B"))
                self.drawString(54, 34, "Department of Computer Engineering, S.P.I.T., Mumbai")
                
                if current_pg < ch1_pg:
                    # Prelim page: Roman numeral
                    roman_pg = to_roman(current_pg)
                    self.drawRightString(541, 34, roman_pg)
                else:
                    # Chapter page: Arabic numeral
                    arab_pg = current_pg - ch1_pg + 1
                    page_str = f"Page {arab_pg} of {arabic_total}"
                    self.drawRightString(541, 34, page_str)
                    
                self.restoreState()
            super().showPage()
        super().save()

def build_pdf_story(is_pass_two=False):
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=21,
        leading=26,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#1E3A8A")
    )

    cover_subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#334155")
    )

    h1_style = ParagraphStyle(
        'ChapterHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=21,
        spaceBefore=14,
        spaceAfter=10,
        textColor=colors.HexColor("#1E3A8A"),
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        spaceBefore=12,
        spaceAfter=6,
        textColor=colors.HexColor("#0F172A"),
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'AcademicBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=6,
        textColor=colors.HexColor("#1E293B")
    )

    caption_style = ParagraphStyle(
        'FigCaption',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        alignment=TA_CENTER,
        spaceBefore=5,
        spaceAfter=10,
        textColor=colors.HexColor("#334155")
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1E293B")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )

    code_style = ParagraphStyle(
        'CodeBox',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor("#0F172A")
    )

    story = []

    # Helper function to render a styled table
    def render_table(matrix, col_widths):
        table_rows = []
        for r_idx, row in enumerate(matrix):
            row_cells = []
            for c_idx, val in enumerate(row):
                if r_idx == 0:
                    row_cells.append(Paragraph(f"<b>{val}</b>", table_header_style))
                else:
                    row_cells.append(Paragraph(val, table_cell_style))
            table_rows.append(row_cells)
        t = Table(table_rows, colWidths=col_widths)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
            ('TOPPADDING', (0,0), (-1,-1), 3.5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        return t

    # Helper function to embed an image safely
    def embed_image(path, caption, max_w=440, max_h=225):
        if not os.path.exists(path):
            return [Paragraph(f"<i>[Image missing: {path}]</i>", caption_style)]
        try:
            with PILImage.open(path) as img:
                w, h = img.size
                ratio = min(max_w / w, max_h / h)
                target_w = int(w * ratio)
                target_h = int(h * ratio)
            return [
                Spacer(1, 4),
                Image(path, width=target_w, height=target_h),
                Paragraph(caption, caption_style),
                Spacer(1, 4)
            ]
        except Exception as e:
            return [Paragraph(f"<i>[Error loading image {path}: {str(e)}]</i>", caption_style)]

    # 1. COVER PAGE
    story.append(Spacer(1, 20))
    story.append(Paragraph("A PROJECT REPORT ON", ParagraphStyle('Sub', fontName='Helvetica-Bold', fontSize=10, alignment=TA_CENTER, textColor=colors.HexColor("#64748B"))))
    story.append(Spacer(1, 15))
    story.append(Paragraph(rc.METADATA["title"].upper(), title_style))
    story.append(Spacer(1, 15))
    story.append(Paragraph("Submitted in partial fulfillment of the requirements for the degree of", cover_subtitle_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"<b>{rc.METADATA['degree']}</b>", ParagraphStyle('Degree', fontName='Helvetica-Bold', fontSize=12, alignment=TA_CENTER, textColor=colors.HexColor("#0F172A"))))
    story.append(Spacer(1, 25))

    # Authors Table
    authors_data = [
        [Paragraph("<b>Submitted By:</b>", ParagraphStyle('AuthH', fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor("#1E3A8A"))),
         Paragraph("<b>Under the Guidance of:</b>", ParagraphStyle('AuthH', fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor("#1E3A8A")))],
        [Paragraph(f"<b>{rc.METADATA['students'][0]['name']}</b><br/>UID: {rc.METADATA['students'][0]['uid']}<br/><br/><b>{rc.METADATA['students'][1]['name']}</b><br/>UID: {rc.METADATA['students'][1]['uid']}", table_cell_style),
         Paragraph(f"<b>{rc.METADATA['guide']['name']}</b><br/>{rc.METADATA['guide']['designation']}<br/>Department of Computer Engineering", table_cell_style)]
    ]
    t_auth = Table(authors_data, colWidths=[240, 240])
    t_auth.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_auth)
    story.append(Spacer(1, 35))

    # Institute block
    story.append(Paragraph(f"<b>{rc.METADATA['department']}</b>", ParagraphStyle('Dept', fontName='Helvetica-Bold', fontSize=12, alignment=TA_CENTER, textColor=colors.HexColor("#1E3A8A"))))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"<b>{rc.METADATA['institution']}</b>", ParagraphStyle('Inst', fontName='Helvetica-Bold', fontSize=11, alignment=TA_CENTER, textColor=colors.HexColor("#0F172A"))))
    story.append(Spacer(1, 4))
    story.append(Paragraph(rc.METADATA['location'], cover_subtitle_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph(f"<b>Academic Year {rc.METADATA['academic_year']}</b>", ParagraphStyle('AY', fontName='Helvetica-Bold', fontSize=11, alignment=TA_CENTER, textColor=colors.HexColor("#2563EB"))))
    story.append(PageBreak())

    # 2. CERTIFICATE PAGE
    story.append(PageTracker("Certificate"))
    story.append(Paragraph("CERTIFICATE", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=15))
    story.append(Paragraph(rc.CERTIFICATE_TEXT.replace('\n\n', '<br/><br/>'), body_style))
    story.append(Spacer(1, 40))

    sig_data = [
        [Paragraph(f"<b>{rc.METADATA['guide']['name']}</b><br/>Project Guide<br/>Assistant Professor", table_cell_style),
         Paragraph(f"<b>{rc.METADATA['hod']['name']}</b><br/>Head of Department<br/>Computer Engineering", table_cell_style)],
        [Spacer(1, 35), Spacer(1, 35)],
        [Paragraph(f"<b>{rc.METADATA['principal']['name']}</b><br/>Principal<br/>S.P.I.T., Mumbai", table_cell_style),
         Paragraph("<b>External Examiner</b><br/>Signature & Seal", table_cell_style)]
    ]
    t_sig = Table(sig_data, colWidths=[240, 240])
    t_sig.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_sig)
    story.append(PageBreak())

    # 3. DECLARATION PAGE
    story.append(PageTracker("Declaration"))
    story.append(Paragraph("DECLARATION", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=15))
    story.append(Paragraph(rc.DECLARATION_TEXT.replace('\n\n', '<br/><br/>'), body_style))
    story.append(Spacer(1, 40))

    decl_data = [
        [Paragraph(f"<b>{rc.METADATA['students'][0]['name']}</b><br/>UID: {rc.METADATA['students'][0]['uid']}", table_cell_style),
         Paragraph(f"<b>{rc.METADATA['students'][1]['name']}</b><br/>UID: {rc.METADATA['students'][1]['uid']}", table_cell_style)],
        [Paragraph("Place: Mumbai<br/>Date: October 30, 2026", table_cell_style), Paragraph("", table_cell_style)]
    ]
    t_decl = Table(decl_data, colWidths=[240, 240])
    t_decl.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_decl)
    story.append(PageBreak())

    # 4. ACKNOWLEDGEMENT PAGE
    story.append(PageTracker("Acknowledgement"))
    story.append(Paragraph("ACKNOWLEDGEMENT", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=15))
    story.append(Paragraph(rc.ACKNOWLEDGEMENT_TEXT.replace('\n\n', '<br/><br/>'), body_style))
    story.append(Spacer(1, 30))
    story.append(Paragraph(f"<b>{rc.METADATA['students'][0]['name']}</b> (UID: {rc.METADATA['students'][0]['uid']})<br/><b>{rc.METADATA['students'][1]['name']}</b> (UID: {rc.METADATA['students'][1]['uid']})", body_style))
    story.append(PageBreak())

    # 5. ABSTRACT PAGE
    story.append(PageTracker("Abstract"))
    story.append(Paragraph("ABSTRACT", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=15))
    story.append(Paragraph(rc.ABSTRACT_TEXT.replace('\n\n', '<br/><br/>'), body_style))
    story.append(Spacer(1, 15))
    story.append(Paragraph("<b>Keywords:</b> Tourism Recommender System, Vector Space Model, TF-IDF Vectorization, Cosine Similarity, Climatological Seasonal Weighting, Constraint Penalties, Itinerary Planning, Single Page Application, React 19, SQLite.", body_style))
    story.append(PageBreak())

    # 6. TABLE OF CONTENTS
    story.append(Paragraph("TABLE OF CONTENTS", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=12))

    ch1_base = GLOBAL_PAGE_MAP.get("Chapter 1: Introduction and Problem Definition", GLOBAL_CH1_START)

    def get_pg_display(key, default_val):
        raw_pg = GLOBAL_PAGE_MAP.get(key)
        if raw_pg is None:
            return default_val
        if raw_pg < ch1_base:
            return to_roman(raw_pg)
        else:
            return str(raw_pg - ch1_base + 1)

    toc_items = [
        ("Certificate", get_pg_display("Certificate", "ii")),
        ("Declaration", get_pg_display("Declaration", "iii")),
        ("Acknowledgement", get_pg_display("Acknowledgement", "iv")),
        ("Abstract", get_pg_display("Abstract", "v")),
        ("List of Abbreviations", get_pg_display("List of Abbreviations", "vii")),
        ("List of Tables", get_pg_display("List of Tables", "viii")),
        ("List of Figures", get_pg_display("List of Figures", "ix")),
        ("Chapter 1: Introduction and Problem Definition", get_pg_display("Chapter 1: Introduction and Problem Definition", "1")),
        ("   1.1 Background and Context", get_pg_display("1.1 Background and Context", "1")),
        ("   1.2 Problem Statement", get_pg_display("1.2 Problem Statement", "1")),
        ("   1.3 Motivation", get_pg_display("1.3 Motivation", "2")),
        ("   1.4 Objectives of the Project", get_pg_display("1.4 Objectives of the Project", "2")),
        ("   1.5 Scope of the Project", get_pg_display("1.5 Scope of the Project", "2")),
        ("   1.6 Proposed Solution Overview", get_pg_display("1.6 Proposed Solution Overview", "3")),
        ("   1.7 Novelty and Innovation", get_pg_display("1.7 Novelty and Innovation", "3")),
        ("   1.8 Feasibility Analysis", get_pg_display("1.8 Feasibility Analysis", "3")),
        ("   1.9 Social and Environmental Relevance", get_pg_display("1.9 Social and Environmental Relevance", "4")),
        ("   1.10 Key Performance Indicators (KPIs)", get_pg_display("1.10 Key Performance Indicators (KPIs)", "4")),
        ("Chapter 2: Literature Review and Study of Existing Systems", get_pg_display("Chapter 2: Literature Review and Study of Existing Systems", "5")),
        ("   2.1 Overview of Modern Recommender Systems in Tourism", get_pg_display("2.1 Overview of Modern Recommender Systems in Tourism", "5")),
        ("   2.2 Comparative Study of Commercial Platforms", get_pg_display("2.2 Comparative Study of Commercial Platforms", "5")),
        ("   2.3 Critical Limitations of Existing Systems", get_pg_display("2.3 Critical Limitations of Existing Systems", "6")),
        ("   2.4 Research and Engineering Gap", get_pg_display("2.4 Research and Engineering Gap", "6")),
        ("   2.5 Justification of the Selected Algorithmic Approach", get_pg_display("2.5 Justification of the Selected Algorithmic Approach", "7")),
        ("Chapter 3: Software Requirements Specification (SRS)", get_pg_display("Chapter 3: Software Requirements Specification (SRS)", "8")),
        ("   3.1 User Personas and Stakeholder Identification", get_pg_display("3.1 User Personas and Stakeholder Identification", "8")),
        ("   3.2 Functional Requirements (FR-01 to FR-14)", get_pg_display("3.2 Functional Requirements", "8")),
        ("   3.3 Non-Functional Requirements", get_pg_display("3.3 Non-Functional Requirements", "9")),
        ("   3.4 Hardware and Infrastructure Requirements", get_pg_display("3.4 Hardware and Infrastructure Requirements", "10")),
        ("   3.5 Software and Technology Stack Specifications", get_pg_display("3.5 Software and Technology Stack Specifications", "10")),
        ("   3.6 Detailed Use Case Specifications", get_pg_display("3.6 Detailed Use Case Specifications", "11")),
        ("Chapter 4: System Architecture and Design", get_pg_display("Chapter 4: System Architecture and Design", "12")),
        ("   4.1 High-Level Layered Architecture", get_pg_display("4.1 High-Level Layered Architecture", "12")),
        ("   4.2 UML Use Case Diagram", get_pg_display("4.2 UML Use Case Diagram", "13")),
        ("   4.3 UML Sequence Diagram: Recommendation Flow", get_pg_display("4.3 UML Sequence Diagram: Recommendation Flow", "14")),
        ("   4.4 Data Flow Diagrams (DFD)", get_pg_display("4.4 Data Flow Diagrams (DFD)", "14")),
        ("   4.5 Relational Database Schema and ER Diagram", get_pg_display("4.5 Relational Database Schema and ER Diagram", "15")),
        ("   4.6 Data Dictionary and Table Structures", get_pg_display("4.6 Data Dictionary and Table Structures", "15")),
        ("   4.7 RESTful API Specifications", get_pg_display("4.7 RESTful API Specifications", "16")),
        ("Chapter 5: Algorithm Design and Data Structures", get_pg_display("Chapter 5: Algorithm Design and Data Structures", "17")),
        ("   5.1 Mathematical Foundations of Vector Space Modeling", get_pg_display("5.1 Mathematical Foundations of Vector Space Modeling (VSM)", "17")),
        ("   5.2 Term Frequency (TF) & Inverse Document Frequency (IDF)", get_pg_display("5.2 Term Frequency (TF) and Inverse Document Frequency (IDF) Formulation", "17")),
        ("   5.3 Vector Normalization and Cosine Similarity Formulation", get_pg_display("5.3 Vector Normalization and Cosine Similarity Formulation", "18")),
        ("   5.4 Hybrid Multi-Criteria Composite Scoring Model", get_pg_display("5.4 Hybrid Multi-Criteria Composite Scoring Model", "18")),
        ("   5.5 Heuristic Penalty Constraint Modeling", get_pg_display("5.5 Heuristic Penalty Constraint Modeling", "19")),
        ("   5.6 Algorithmic Pipeline and Formal Pseudocode", get_pg_display("5.6 Algorithmic Pipeline and Formal Pseudocode", "19")),
        ("   5.7 Time and Space Complexity Analysis", get_pg_display("5.7 Time and Space Complexity Analysis", "20")),
        ("Chapter 6: Subject-Wise Engineering Concepts & APNI Leap Alignment", get_pg_display("Chapter 6: Subject-Wise Engineering Concepts & APNI Leap Alignment", "21")),
        ("   6.1 Software Engineering (SE)", get_pg_display("6.1 Software Engineering (SE)", "21")),
        ("   6.2 Computer Networks and Web Technologies (CN & WT)", get_pg_display("6.2 Computer Networks and Web Technologies (CN & WT)", "21")),
        ("   6.3 Database Management Systems (DBMS)", get_pg_display("6.3 Database Management Systems (DBMS)", "22")),
        ("   6.4 Operating Systems and Concurrency (OS)", get_pg_display("6.4 Operating Systems and Concurrency (OS)", "22")),
        ("   6.5 Data Structures and Algorithms (DSA & DAA)", get_pg_display("6.5 Data Structures and Design & Analysis of Algorithms (DSA & DAA)", "23")),
        ("Chapter 7: Implementation and Module-Wise Coding", get_pg_display("Chapter 7: Implementation and Module-Wise Coding", "24")),
        ("   7.1 Development Environment and Codebase Structure", get_pg_display("7.1 Development Environment and Codebase Structure", "24")),
        ("   7.2 Frontend Implementation Details", get_pg_display("7.2 Frontend Implementation Details", "24")),
        ("   7.3 Backend Implementation Details", get_pg_display("7.3 Backend Implementation Details", "25")),
        ("   7.4 Catalog Seeding and Image Synchronization Subsystem", get_pg_display("7.4 Catalog Seeding and Image Synchronization Subsystem", "25")),
        ("   7.5 Team Member Contributions and Work Allocation", get_pg_display("7.5 Team Member Contributions and Work Allocation", "26")),
        ("   7.6 System Integration Challenges and Technical Solutions", get_pg_display("7.6 System Integration Challenges and Technical Solutions", "26")),
        ("Chapter 8: Scalability, Performance and Resource Management", get_pg_display("Chapter 8: Scalability, Performance and Resource Management", "27")),
        ("   8.1 Workload Modeling and Concurrency Profile", get_pg_display("8.1 Workload Modeling and Concurrency Profile", "27")),
        ("   8.2 Computational Bottleneck Identification", get_pg_display("8.2 Computational Bottleneck Identification", "27")),
        ("   8.3 Performance Optimization Techniques", get_pg_display("8.3 Performance Optimization Techniques", "27")),
        ("   8.4 Empirical Benchmark Results", get_pg_display("8.4 Empirical Benchmark Results", "28")),
        ("   8.5 Resource Utilization and Memory Footprint", get_pg_display("8.5 Resource Utilization and Memory Footprint", "28")),
        ("Chapter 9: Testing and Validation", get_pg_display("Chapter 9: Testing and Validation", "29")),
        ("   9.1 Testing Philosophy and Methodology", get_pg_display("9.1 Testing Philosophy and Methodology", "29")),
        ("   9.2 Test Suite Architecture and Distribution", get_pg_display("9.2 Test Suite Architecture and Distribution", "29")),
        ("   9.3 Comprehensive Test Case Matrix (TC-01 to TC-14)", get_pg_display("9.3 Comprehensive Test Case Matrix", "30")),
        ("   9.4 Validation Against Project Objectives and KPIs", get_pg_display("9.4 Validation Against Project Objectives and KPIs", "31")),
        ("Chapter 10: Results, Demonstration and Discussion", get_pg_display("Chapter 10: Results, Demonstration and Discussion", "32")),
        ("   10.1 System Walkthrough and Visual Demonstrations", get_pg_display("10.1 System Walkthrough and Visual Demonstrations", "32")),
        ("   10.2 Experimental Evaluation and User Experience Feedback", get_pg_display("10.2 Experimental Evaluation and User Experience Feedback", "34")),
        ("   10.3 Discussion of Results and Comparative Strengths", get_pg_display("10.3 Discussion of Results and Comparative Strengths", "34")),
        ("Chapter 11: Conclusion and Future Scope", get_pg_display("Chapter 11: Conclusion and Future Scope", "35")),
        ("   11.1 Conclusion and Summary of Work", get_pg_display("11.1 Conclusion and Summary of Work", "35")),
        ("   11.2 Key Engineering Contributions", get_pg_display("11.2 Key Engineering Contributions", "35")),
        ("   11.3 System Limitations", get_pg_display("11.3 System Limitations", "35")),
        ("   11.4 Future Scope and Roadmap", get_pg_display("11.4 Future Scope and Roadmap", "36")),
        ("   11.5 Key Learning Outcomes and Reflections", get_pg_display("11.5 Key Learning Outcomes and Reflections", "36")),
        ("References", get_pg_display("References", "37")),
        ("Appendix A: Academic Integrity & Verification Statement", get_pg_display("Appendix A", "38"))
    ]

    toc_table_data = []
    for title, pg in toc_items:
        is_ch = title.startswith("Chapter ") or title in ["Certificate", "Declaration", "Acknowledgement", "Abstract", "References", "List of Abbreviations", "List of Tables", "List of Figures"] or title.startswith("Appendix")
        t_style = ParagraphStyle('TOCItem', fontName='Helvetica-Bold' if is_ch else 'Helvetica', fontSize=8.2, leading=11.5, textColor=colors.HexColor("#1E3A8A") if is_ch else colors.HexColor("#1E293B"))
        p_style = ParagraphStyle('TOCPg', fontName='Helvetica-Bold' if is_ch else 'Helvetica', fontSize=8.2, leading=11.5, alignment=TA_RIGHT, textColor=colors.HexColor("#1E3A8A") if is_ch else colors.HexColor("#475569"))
        toc_table_data.append([Paragraph(title, t_style), Paragraph(str(pg), p_style)])

    t_toc = Table(toc_table_data, colWidths=[420, 60])
    t_toc.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.2),
        ('TOPPADDING', (0,0), (-1,-1), 1.2),
    ]))
    story.append(t_toc)
    story.append(PageBreak())

    # 7. LIST OF ABBREVIATIONS
    story.append(PageTracker("List of Abbreviations"))
    story.append(Paragraph("LIST OF ABBREVIATIONS", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=15))
    
    abbr_data = [[Paragraph("<b>Abbreviation</b>", table_header_style), Paragraph("<b>Full Form / Definition</b>", table_header_style)]]
    for ab, desc in rc.ABBREVIATIONS:
        abbr_data.append([Paragraph(f"<b>{ab}</b>", table_cell_style), Paragraph(desc, table_cell_style)])
    
    t_abbr = Table(abbr_data, colWidths=[110, 370])
    t_abbr.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_abbr)
    story.append(PageBreak())

    # 8. LIST OF TABLES & LIST OF FIGURES
    story.append(PageTracker("List of Tables"))
    story.append(Paragraph("LIST OF TABLES", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=15))
    tbl_data = [[Paragraph("<b>Table No.</b>", table_header_style), Paragraph("<b>Table Title</b>", table_header_style)]]
    for num, title in rc.TABLES_LIST:
        tbl_data.append([Paragraph(f"<b>{num}</b>", table_cell_style), Paragraph(title, table_cell_style)])
    t_list_tbl = Table(tbl_data, colWidths=[90, 390])
    t_list_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(t_list_tbl)
    story.append(Spacer(1, 20))

    story.append(PageTracker("List of Figures"))
    story.append(Paragraph("LIST OF FIGURES", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=15))
    fig_data = [[Paragraph("<b>Figure No.</b>", table_header_style), Paragraph("<b>Figure Title</b>", table_header_style)]]
    for num, title in rc.FIGURES_LIST:
        fig_data.append([Paragraph(f"<b>{num}</b>", table_cell_style), Paragraph(title, table_cell_style)])
    t_list_fig = Table(fig_data, colWidths=[90, 390])
    t_list_fig.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(t_list_fig)
    story.append(PageBreak())

    # 9. CHAPTER 1
    story.append(PageTracker("Chapter 1: Introduction and Problem Definition"))
    story.append(Paragraph("CHAPTER 1", ParagraphStyle('ChLabel', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#2563EB"))))
    story.append(Paragraph(rc.CHAPTER_1["title"].upper(), h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=12))
    for sec_title, sec_content in rc.CHAPTER_1["sections"]:
        story.append(PageTracker(sec_title))
        story.append(Paragraph(sec_title, h2_style))
        for p in sec_content.split('\n\n'):
            story.append(Paragraph(p.replace('\n', '<br/>'), body_style))
    story.append(PageBreak())

    # 10. CHAPTER 2
    story.append(PageTracker("Chapter 2: Literature Review and Study of Existing Systems"))
    story.append(Paragraph("CHAPTER 2", ParagraphStyle('ChLabel', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#2563EB"))))
    story.append(Paragraph(rc.CHAPTER_2["title"].upper(), h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=12))
    for sec_title, sec_content in rc.CHAPTER_2["sections"]:
        story.append(PageTracker(sec_title))
        story.append(Paragraph(sec_title, h2_style))
        for p in sec_content.split('\n\n'):
            story.append(Paragraph(p.replace('\n', '<br/>'), body_style))
        if "2.2" in sec_title:
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 2.1: Comparative Analysis of Modern Travel and Recommendation Platforms</b>", caption_style))
            story.append(render_table(rc.TABLE_2_1_DATA, [90, 80, 80, 75, 75, 80]))
            story.append(Spacer(1, 8))
    story.append(PageBreak())

    # 11. CHAPTER 3
    story.append(PageTracker("Chapter 3: Software Requirements Specification (SRS)"))
    story.append(Paragraph("CHAPTER 3", ParagraphStyle('ChLabel', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#2563EB"))))
    story.append(Paragraph(rc.CHAPTER_3["title"].upper(), h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=12))
    for sec_title, sec_content in rc.CHAPTER_3["sections"]:
        story.append(PageTracker(sec_title))
        story.append(Paragraph(sec_title, h2_style))
        for p in sec_content.split('\n\n'):
            story.append(Paragraph(p.replace('\n', '<br/>'), body_style))
        if "3.2" in sec_title:
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 3.1: Functional Requirements Specification (FR-01 to FR-14)</b>", caption_style))
            story.append(render_table(rc.TABLE_3_1_DATA, [50, 110, 270, 50]))
            story.append(Spacer(1, 8))
        elif "3.3" in sec_title:
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 3.2: Non-Functional Requirements Specification</b>", caption_style))
            story.append(render_table(rc.TABLE_3_2_DATA, [55, 75, 230, 120]))
            story.append(Spacer(1, 8))
        elif "3.4" in sec_title:
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 3.3: Hardware and Development Infrastructure Requirements</b>", caption_style))
            story.append(render_table(rc.TABLE_3_3_DATA, [110, 180, 190]))
            story.append(Spacer(1, 8))
        elif "3.5" in sec_title:
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 3.4: Software and Technology Stack Specifications</b>", caption_style))
            story.append(render_table(rc.TABLE_3_4_DATA, [100, 90, 50, 240]))
            story.append(Spacer(1, 8))
    story.append(PageBreak())

    # 12. CHAPTER 4
    story.append(PageTracker("Chapter 4: System Architecture and Design"))
    story.append(Paragraph("CHAPTER 4", ParagraphStyle('ChLabel', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#2563EB"))))
    story.append(Paragraph(rc.CHAPTER_4["title"].upper(), h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=12))
    for sec_title, sec_content in rc.CHAPTER_4["sections"]:
        story.append(PageTracker(sec_title))
        story.append(Paragraph(sec_title, h2_style))
        for p in sec_content.split('\n\n'):
            story.append(Paragraph(p.replace('\n', '<br/>'), body_style))
        if "4.1" in sec_title:
            for item in embed_image("report_assets/fig_4_1_architecture.png", "Figure 4.1: Three-Tier Client-Server Architecture of TripMeta"):
                story.append(item)
        elif "4.2" in sec_title:
            for item in embed_image("report_assets/fig_4_2_use_case.png", "Figure 4.2: UML Use Case Diagram of the TripMeta Platform"):
                story.append(item)
        elif "4.3" in sec_title:
            for item in embed_image("report_assets/fig_4_3_sequence.png", "Figure 4.3: UML Sequence Diagram: Travel Recommendation Generation Flow"):
                story.append(item)
        elif "4.5" in sec_title:
            for item in embed_image("report_assets/fig_4_4_er_diagram.png", "Figure 4.4: Entity-Relationship (ER) Diagram of SQLite Database"):
                story.append(item)
        elif "4.6" in sec_title:
            story.append(Spacer(1, 4))
            story.append(Paragraph("<b>Table 4.1: Database Schema: destinations Table</b>", caption_style))
            story.append(render_table(rc.TABLE_4_1_DATA, [80, 70, 130, 200]))
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 4.2: Database Schema: trips Table</b>", caption_style))
            story.append(render_table(rc.TABLE_4_2_DATA, [80, 70, 130, 200]))
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 4.3: Database Schema: saved_destinations Table</b>", caption_style))
            story.append(render_table(rc.TABLE_4_3_DATA, [80, 70, 130, 200]))
            story.append(Spacer(1, 6))
        elif "4.7" in sec_title:
            story.append(Spacer(1, 4))
            story.append(Paragraph("<b>Table 4.4: RESTful API Endpoints Specification</b>", caption_style))
            story.append(render_table(rc.TABLE_4_4_DATA, [55, 115, 130, 60, 120]))
            story.append(Spacer(1, 6))
    story.append(PageBreak())

    # 13. CHAPTER 5
    story.append(PageTracker("Chapter 5: Algorithm Design and Data Structures"))
    story.append(Paragraph("CHAPTER 5", ParagraphStyle('ChLabel', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#2563EB"))))
    story.append(Paragraph(rc.CHAPTER_5["title"].upper(), h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=12))
    for sec_title, sec_content in rc.CHAPTER_5["sections"]:
        story.append(PageTracker(sec_title))
        story.append(Paragraph(sec_title, h2_style))
        for p in sec_content.split('\n\n'):
            if p.startswith("--------------------------------------------------------------------------------"):
                algo_text = p.replace('\n', '<br/>').replace(' ', '&nbsp;')
                t_algo = Table([[Paragraph(algo_text, code_style)]], colWidths=[480])
                t_algo.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#64748B")),
                    ('TOPPADDING', (0,0), (-1,-1), 6),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                    ('LEFTPADDING', (0,0), (-1,-1), 8),
                    ('RIGHTPADDING', (0,0), (-1,-1), 8),
                ]))
                story.append(t_algo)
                story.append(Spacer(1, 6))
            else:
                story.append(Paragraph(p.replace('\n', '<br/>'), body_style))
        if "5.6" in sec_title:
            for item in embed_image("report_assets/fig_5_1_algorithm_pipeline.png", "Figure 5.1: TF-IDF Vector Space and Multi-Factor Scoring Pipeline Flowchart"):
                story.append(item)
        elif "5.7" in sec_title:
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 5.1: Computational Complexity of Recommendation Engine Pipeline</b>", caption_style))
            story.append(render_table(rc.TABLE_5_1_DATA, [120, 85, 75, 200]))
            story.append(Spacer(1, 8))
    story.append(PageBreak())

    # 14. CHAPTER 6
    story.append(PageTracker("Chapter 6: Subject-Wise Engineering Concepts & APNI Leap Alignment"))
    story.append(Paragraph("CHAPTER 6", ParagraphStyle('ChLabel', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#2563EB"))))
    story.append(Paragraph(rc.CHAPTER_6["title"].upper(), h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=12))
    for sec_title, sec_content in rc.CHAPTER_6["sections"]:
        story.append(PageTracker(sec_title))
        story.append(Paragraph(sec_title, h2_style))
        for p in sec_content.split('\n\n'):
            story.append(Paragraph(p.replace('\n', '<br/>'), body_style))
    story.append(PageBreak())

    # 15. CHAPTER 7
    story.append(PageTracker("Chapter 7: Implementation and Module-Wise Coding"))
    story.append(Paragraph("CHAPTER 7", ParagraphStyle('ChLabel', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#2563EB"))))
    story.append(Paragraph(rc.CHAPTER_7["title"].upper(), h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=12))
    for sec_title, sec_content in rc.CHAPTER_7["sections"]:
        story.append(PageTracker(sec_title))
        story.append(Paragraph(sec_title, h2_style))
        for p in sec_content.split('\n\n'):
            story.append(Paragraph(p.replace('\n', '<br/>'), body_style))
        if "7.5" in sec_title:
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 7.1: Team Member Contributions and Task Allocation Matrix</b>", caption_style))
            story.append(render_table(rc.TABLE_7_1_DATA, [130, 90, 260]))
            story.append(Spacer(1, 8))
        elif "7.6" in sec_title:
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 7.2: System Integration Challenges and Technical Solutions</b>", caption_style))
            story.append(render_table(rc.TABLE_7_2_DATA, [50, 110, 130, 190]))
            story.append(Spacer(1, 8))
    story.append(PageBreak())

    # 16. CHAPTER 8
    story.append(PageTracker("Chapter 8: Scalability, Performance and Resource Management"))
    story.append(Paragraph("CHAPTER 8", ParagraphStyle('ChLabel', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#2563EB"))))
    story.append(Paragraph(rc.CHAPTER_8["title"].upper(), h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=12))
    for sec_title, sec_content in rc.CHAPTER_8["sections"]:
        story.append(PageTracker(sec_title))
        story.append(Paragraph(sec_title, h2_style))
        for p in sec_content.split('\n\n'):
            story.append(Paragraph(p.replace('\n', '<br/>'), body_style))
        if "8.4" in sec_title:
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 8.1: System Performance and Stress Test Metrics</b>", caption_style))
            story.append(render_table(rc.TABLE_8_1_DATA, [70, 60, 65, 75, 75, 70, 65]))
            story.append(Spacer(1, 6))
            for item in embed_image("report_assets/fig_8_1_performance_benchmark.png", "Figure 8.1: Scalability Benchmarks: Request Latency and Throughput vs Concurrency"):
                story.append(item)
    story.append(PageBreak())

    # 17. CHAPTER 9
    story.append(PageTracker("Chapter 9: Testing and Validation"))
    story.append(Paragraph("CHAPTER 9", ParagraphStyle('ChLabel', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#2563EB"))))
    story.append(Paragraph(rc.CHAPTER_9["title"].upper(), h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=12))
    for sec_title, sec_content in rc.CHAPTER_9["sections"]:
        story.append(PageTracker(sec_title))
        story.append(Paragraph(sec_title, h2_style))
        for p in sec_content.split('\n\n'):
            story.append(Paragraph(p.replace('\n', '<br/>'), body_style))
        if "9.2" in sec_title:
            for item in embed_image("report_assets/fig_9_1_test_distribution.png", "Figure 9.1: TripMeta Test Suite Coverage and Execution Distribution", max_w=350, max_h=210):
                story.append(item)
        elif "9.3" in sec_title:
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 9.1: Comprehensive System Test Case Execution Matrix (TC-01 to TC-14)</b>", caption_style))
            story.append(render_table(rc.TABLE_9_1_DATA, [40, 75, 70, 95, 95, 75, 30]))
            story.append(Spacer(1, 8))
        elif "9.4" in sec_title:
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 9.2: Validation of Project Objectives Against Experimental Metrics</b>", caption_style))
            story.append(render_table(rc.TABLE_9_2_DATA, [100, 120, 180, 80]))
            story.append(Spacer(1, 8))
    story.append(PageBreak())

    # 18. CHAPTER 10
    story.append(PageTracker("Chapter 10: Results, Demonstration and Discussion"))
    story.append(Paragraph("CHAPTER 10", ParagraphStyle('ChLabel', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#2563EB"))))
    story.append(Paragraph(rc.CHAPTER_10["title"].upper(), h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=12))
    for sec_title, sec_content in rc.CHAPTER_10["sections"]:
        story.append(PageTracker(sec_title))
        story.append(Paragraph(sec_title, h2_style))
        for p in sec_content.split('\n\n'):
            story.append(Paragraph(p.replace('\n', '<br/>'), body_style))
        if "10.1" in sec_title:
            story.append(Spacer(1, 6))
            for item in embed_image("report_assets/fig_10_1_home.png", "Figure 10.1: TripMeta Home Portal: Curated Mood Explorer & Top Highlights", max_h=195):
                story.append(item)
            story.append(Spacer(1, 6))
            for item in embed_image("report_assets/fig_10_2_explore.png", "Figure 10.2: Interactive Destination Atlas with State and Category Filters", max_h=195):
                story.append(item)
            story.append(Spacer(1, 6))
            for item in embed_image("report_assets/fig_10_3_plan.png", "Figure 10.3: Multi-Criteria Travel Preference Input Wizard ('Plan My Trip')", max_h=195):
                story.append(item)
            story.append(Spacer(1, 6))
            for item in embed_image("report_assets/fig_10_4_destination.png", "Figure 10.4: Comprehensive Destination Details, Logistics, and Nearby Spots", max_h=195):
                story.append(item)
            story.append(Spacer(1, 6))
            for item in embed_image("report_assets/fig_10_5_saved.png", "Figure 10.5: Saved Destinations and Bookmark Management Dashboard", max_h=195):
                story.append(item)
            story.append(Spacer(1, 6))
            for item in embed_image("report_assets/fig_10_6_trip_builder.png", "Figure 10.6: Custom Multi-Day Trip Itinerary Builder with Budget Tracking", max_h=195):
                story.append(item)
            story.append(Spacer(1, 6))
            for item in embed_image("report_assets/fig_10_7_results.png", "Figure 10.7: Personalized Recommendation Results with Real-Time Match Scores", max_h=195):
                story.append(item)
        elif "10.3" in sec_title:
            story.append(Spacer(1, 6))
            story.append(Paragraph("<b>Table 10.1: Feature Comparison: TripMeta vs Commercial OTAs</b>", caption_style))
            story.append(render_table(rc.TABLE_10_1_DATA, [100, 130, 120, 130]))
            story.append(Spacer(1, 8))
    story.append(PageBreak())

    # 19. CHAPTER 11
    story.append(PageTracker("Chapter 11: Conclusion and Future Scope"))
    story.append(Paragraph("CHAPTER 11", ParagraphStyle('ChLabel', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#2563EB"))))
    story.append(Paragraph(rc.CHAPTER_11["title"].upper(), h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=12))
    for sec_title, sec_content in rc.CHAPTER_11["sections"]:
        story.append(PageTracker(sec_title))
        story.append(Paragraph(sec_title, h2_style))
        for p in sec_content.split('\n\n'):
            story.append(Paragraph(p.replace('\n', '<br/>'), body_style))
    story.append(PageBreak())

    # 20. REFERENCES
    story.append(PageTracker("References"))
    story.append(Paragraph("REFERENCES", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=15))
    ref_style = ParagraphStyle(
        'RefStyle',
        parent=body_style,
        leftIndent=24,
        firstLineIndent=-24,
        spaceAfter=6
    )
    for ref in rc.REFERENCES_LIST:
        story.append(Paragraph(ref, ref_style))
    story.append(PageBreak())

    # 21. APPENDIX A
    story.append(PageTracker("Appendix A"))
    story.append(Paragraph("APPENDIX A", ParagraphStyle('ChLabel', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#2563EB"))))
    story.append(Paragraph("ACADEMIC INTEGRITY & VERIFICATION STATEMENT", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1E3A8A"), spaceAfter=15))
    for p in rc.APPENDIX_A_TEXT.split('\n\n'):
        story.append(Paragraph(p.replace('\n', '<br/>'), body_style))

    return story

def create_pdf(output_filename="TripMeta_Final_Project_Report.pdf"):
    print(f"Executing two-pass build for: {output_filename}")
    
    # Pass 1: Build to temp file to capture real page numbers
    temp_pdf = "temp_pass1.pdf"
    doc1 = SimpleDocTemplate(temp_pdf, pagesize=A4, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54)
    story1 = build_pdf_story(is_pass_two=False)
    doc1.build(story1, canvasmaker=NumberedCanvas)
    
    if os.path.exists(temp_pdf):
        os.remove(temp_pdf)
    
    print(f"Pass 1 captured {len(GLOBAL_PAGE_MAP)} page anchors.")
    ch1_p = GLOBAL_PAGE_MAP.get("Chapter 1: Introduction and Problem Definition", 10)
    print(f"Chapter 1 starts on raw page {ch1_p}")

    # Pass 2: Build final PDF with populated Table of Contents
    doc2 = SimpleDocTemplate(output_filename, pagesize=A4, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54)
    story2 = build_pdf_story(is_pass_two=True)
    doc2.build(story2, canvasmaker=NumberedCanvas)
    print(f"Pass 2 finished successfully: {output_filename}")

if __name__ == "__main__":
    create_pdf()
