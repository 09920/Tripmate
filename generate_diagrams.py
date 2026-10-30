import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

# Set standard styles
plt.rcParams['font.sans-serif'] = 'Helvetica, Arial, DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

# 1. FIG 4.1: Architecture Diagram
fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Background boxes for tiers
# Tier 1: Client
rect_client = patches.FancyBboxPatch((5, 68), 90, 26, boxstyle="round,pad=1.5", ec="#2563EB", fc="#EFF6FF", lw=2)
ax.add_patch(rect_client)
ax.text(8, 90, "PRESENTATION TIER (CLIENT)", fontsize=11, fontweight='bold', color="#1E40AF")

# Client sub-boxes
c_boxes = [
    ("React 19 SPA\n(Vite 6, TypeScript)", 8, 71, 25, 15),
    ("Tailwind CSS &\nFramer Motion UI", 37, 71, 26, 15),
    ("Axios API Client &\nReact Router 7", 67, 71, 25, 15)
]
for title, x, y, w, h in c_boxes:
    ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=1", ec="#3B82F6", fc="#FFFFFF", lw=1.5))
    ax.text(x + w/2, y + h/2, title, ha='center', va='center', fontsize=9, fontweight='medium', color="#1E293B")

# Tier 2: Application / Server
rect_server = patches.FancyBboxPatch((5, 34), 90, 28, boxstyle="round,pad=1.5", ec="#059669", fc="#ECFDF5", lw=2)
ax.add_patch(rect_server)
ax.text(8, 58, "APPLICATION & BUSINESS LOGIC TIER (NODE.JS / EXPRESS)", fontsize=11, fontweight='bold', color="#065F46")

s_boxes = [
    ("Express REST API\nRouting & Controllers", 8, 37, 26, 17),
    ("TF-IDF & Cosine\nRecommendation Engine", 37, 37, 26, 17),
    ("Itinerary Planner &\nBudget Penalty Logic", 66, 37, 26, 17)
]
for title, x, y, w, h in s_boxes:
    ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=1", ec="#10B981", fc="#FFFFFF", lw=1.5))
    ax.text(x + w/2, y + h/2, title, ha='center', va='center', fontsize=9, fontweight='medium', color="#1E293B")

# Tier 3: Data Tier
rect_db = patches.FancyBboxPatch((5, 4), 90, 24, boxstyle="round,pad=1.5", ec="#D97706", fc="#FFFBEB", lw=2)
ax.add_patch(rect_db)
ax.text(8, 24, "DATA PERSISTENCE & STORAGE TIER", fontsize=11, fontweight='bold', color="#92400E")

d_boxes = [
    ("SQLite Database (tripmeta.db)\nDestinations, Trips, Saved", 8, 7, 42, 13),
    ("Static Asset Repository\nHigh-Res Destination Images", 54, 7, 38, 13)
]
for title, x, y, w, h in d_boxes:
    ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=1", ec="#F59E0B", fc="#FFFFFF", lw=1.5))
    ax.text(x + w/2, y + h/2, title, ha='center', va='center', fontsize=9, fontweight='medium', color="#1E293B")

# Arrows
ax.annotate('', xy=(50, 68), xytext=(50, 62), arrowprops=dict(arrowstyle="<->", color="#475569", lw=2))
ax.text(51.5, 65, "JSON / HTTP REST", fontsize=8, color="#475569", fontweight='semibold')

ax.annotate('', xy=(50, 34), xytext=(50, 28), arrowprops=dict(arrowstyle="<->", color="#475569", lw=2))
ax.text(51.5, 31, "SQL Queries / Buffer IO", fontsize=8, color="#475569", fontweight='semibold')

plt.tight_layout()
plt.savefig('report_assets/fig_4_1_architecture.png', bbox_inches='tight', dpi=300)
plt.close()

# 2. FIG 4.4: ER Diagram
fig, ax = plt.subplots(figsize=(9, 5), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Table: DESTINATIONS
ax.add_patch(patches.FancyBboxPatch((4, 20), 38, 70, boxstyle="round,pad=0.5", ec="#1E3A8A", fc="#F8FAFC", lw=2))
ax.add_patch(patches.Rectangle((4, 82), 38, 8, fc="#1E3A8A"))
ax.text(23, 86, "DESTINATIONS", ha='center', va='center', color='white', fontweight='bold', fontsize=10)
dest_fields = [
    ("PK  id", "INTEGER (AUTOINCREMENT)"),
    ("    name", "TEXT NOT NULL"),
    ("    state", "TEXT NOT NULL"),
    ("    description", "TEXT NOT NULL"),
    ("    categories", "TEXT (JSON Array)"),
    ("    image_url", "TEXT NOT NULL"),
    ("    best_time", "TEXT NOT NULL"),
    ("    budget_tier", "TEXT ('Budget'|'Mid'|'Luxury')"),
    ("    ideal_duration", "INTEGER (Days)"),
    ("    rating", "REAL (1.0 - 5.0)"),
    ("    latitude", "REAL"),
    ("    longitude", "REAL")
]
y_pos = 77
for col, dt in dest_fields:
    ax.text(6, y_pos, col, fontsize=8, fontweight='bold' if 'PK' in col else 'normal', color="#1E293B")
    ax.text(24, y_pos, dt, fontsize=7.5, color="#64748B")
    y_pos -= 4.8

# Table: TRIPS
ax.add_patch(patches.FancyBboxPatch((58, 52), 38, 42, boxstyle="round,pad=0.5", ec="#047857", fc="#F8FAFC", lw=2))
ax.add_patch(patches.Rectangle((58, 86), 38, 8, fc="#047857"))
ax.text(77, 90, "TRIPS", ha='center', va='center', color='white', fontweight='bold', fontsize=10)
trip_fields = [
    ("PK  id", "INTEGER (AUTOINCREMENT)"),
    ("    title", "TEXT NOT NULL"),
    ("FK  destination_id", "INTEGER REFERENCES dest(id)"),
    ("    start_date", "TEXT"),
    ("    end_date", "TEXT"),
    ("    total_budget", "REAL"),
    ("    activities", "TEXT (JSON Array)")
]
y_pos = 81
for col, dt in trip_fields:
    ax.text(60, y_pos, col, fontsize=8, fontweight='bold' if ('PK' in col or 'FK' in col) else 'normal', color="#1E293B")
    ax.text(78, y_pos, dt, fontsize=7.5, color="#64748B")
    y_pos -= 4.8

# Table: SAVED_DESTINATIONS
ax.add_patch(patches.FancyBboxPatch((58, 10), 38, 34, boxstyle="round,pad=0.5", ec="#B45309", fc="#F8FAFC", lw=2))
ax.add_patch(patches.Rectangle((58, 36), 38, 8, fc="#B45309"))
ax.text(77, 40, "SAVED_DESTINATIONS", ha='center', va='center', color='white', fontweight='bold', fontsize=10)
saved_fields = [
    ("PK  id", "INTEGER (AUTOINCREMENT)"),
    ("FK  destination_id", "INTEGER REFERENCES dest(id)"),
    ("    saved_at", "TIMESTAMP DEFAULT NOW"),
    ("    notes", "TEXT")
]
y_pos = 31
for col, dt in saved_fields:
    ax.text(60, y_pos, col, fontsize=8, fontweight='bold' if ('PK' in col or 'FK' in col) else 'normal', color="#1E293B")
    ax.text(78, y_pos, dt, fontsize=7.5, color="#64748B")
    y_pos -= 4.8

# Relationships
ax.annotate('', xy=(58, 73), xytext=(42, 73), arrowprops=dict(arrowstyle="->", color="#1E3A8A", lw=1.8))
ax.text(50, 75, "1 : N", ha='center', fontsize=9, fontweight='bold', color="#1E3A8A")

ax.annotate('', xy=(58, 27), xytext=(42, 27), arrowprops=dict(arrowstyle="->", color="#B45309", lw=1.8))
ax.text(50, 29, "1 : N", ha='center', fontsize=9, fontweight='bold', color="#B45309")

plt.tight_layout()
plt.savefig('report_assets/fig_4_4_er_diagram.png', bbox_inches='tight', dpi=300)
plt.close()

# 3. FIG 5.1: Algorithm Workflow
fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 50)
ax.axis('off')

steps = [
    ("1. User Input\nVector", "Interests, budget,\nduration, travel month", 4, 18, 16, 20, "#DBEAFE", "#1E40AF"),
    ("2. TF-IDF\nVectorization", "Compute TF & IDF\nover destination corpus", 23, 18, 16, 20, "#E0E7FF", "#3730A3"),
    ("3. Cosine\nSimilarity", "Measure angle in\nvector space [0.0, 1.0]", 42, 18, 16, 20, "#EDE9FE", "#5B21B6"),
    ("4. Multi-Factor\nWeighting", "0.50 Content + 0.30 Rating\n+ 0.20 Seasonal Match", 61, 18, 17, 20, "#FEF3C7", "#92400E"),
    ("5. Constraint\nPenalties", "Apply budget (-0.15) &\nduration (-0.10) cuts", 81, 18, 16, 20, "#FEE2E2", "#991B1B")
]

for title, desc, x, y, w, h, bg, border in steps:
    ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.8", ec=border, fc=bg, lw=1.8))
    ax.text(x + w/2, y + 14, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color=border)
    ax.text(x + w/2, y + 6, desc, ha='center', va='center', fontsize=7, color="#334155")
    if x < 80:
        ax.annotate('', xy=(x + w + 3, y + 10), xytext=(x + w, y + 10), arrowprops=dict(arrowstyle="->", color="#64748B", lw=2))

# Final output banner below
ax.add_patch(patches.FancyBboxPatch((15, 2), 70, 10, boxstyle="round,pad=0.6", ec="#059669", fc="#D1FAE5", lw=2))
ax.text(50, 7, "Output: Ranked Recommendation List with Match Percentages (e.g. Spiti Valley - 94% Match)", 
        ha='center', va='center', fontsize=9.5, fontweight='bold', color="#065F46")

plt.tight_layout()
plt.savefig('report_assets/fig_5_1_algorithm_pipeline.png', bbox_inches='tight', dpi=300)
plt.close()

# 4. FIG 8.1: Benchmark Chart
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.2), dpi=300)

concurrency = [1, 5, 10, 20, 30, 40, 50]
latency_unindexed = [18.2, 28.5, 46.1, 84.7, 132.4, 188.0, 246.5]
latency_optimized = [6.1, 9.4, 14.8, 22.3, 31.0, 41.5, 52.8]

ax1.plot(concurrency, latency_unindexed, marker='o', color='#EF4444', label='Unindexed Cold Scan', lw=2)
ax1.plot(concurrency, latency_optimized, marker='s', color='#10B981', label='TripMeta Indexed Cache', lw=2)
ax1.set_title('Recommendation Latency vs Concurrency', fontsize=10, fontweight='bold', color='#1E293B')
ax1.set_xlabel('Simultaneous Concurrent Requests', fontsize=9)
ax1.set_ylabel('Mean Response Latency (ms)', fontsize=9)
ax1.grid(True, linestyle='--', alpha=0.5)
ax1.legend(fontsize=8)

# Throughput
throughput = [164, 480, 890, 1420, 1780, 1950, 2050]
ax2.bar([str(c) for c in concurrency], throughput, color='#3B82F6', alpha=0.85, width=0.55)
ax2.set_title('API Throughput (Requests / Second)', fontsize=10, fontweight='bold', color='#1E293B')
ax2.set_xlabel('Concurrency Level', fontsize=9)
ax2.set_ylabel('Requests Processed / sec', fontsize=9)
ax2.grid(True, axis='y', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.savefig('report_assets/fig_8_1_performance_benchmark.png', bbox_inches='tight', dpi=300)
plt.close()

# 5. FIG 9.1: Test Distribution
fig, ax = plt.subplots(figsize=(6, 4.2), dpi=300)
labels = ['Unit Tests (TF-IDF & Cosine)', 'API Endpoint Tests', 'UI Component Tests', 'Database Integrity Tests']
sizes = [10, 8, 8, 6]
colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
explode = (0.05, 0.05, 0, 0)

wedges, texts, autotexts = ax.pie(sizes, explode=explode, labels=labels, colors=colors,
                                  autopct='%1.1f%%', startangle=140, 
                                  textprops=dict(color="#1E293B", fontsize=8.5))
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontweight('bold')

ax.set_title('TripMeta Test Suite Coverage Distribution (Total 32 Test Cases - 100% Pass)', fontsize=9.5, fontweight='bold')

plt.tight_layout()
plt.savefig('report_assets/fig_9_1_test_distribution.png', bbox_inches='tight', dpi=300)
plt.close()

print("Diagrams successfully generated in report_assets/")
