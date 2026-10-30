import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# 1. Use Case Diagram
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# System Boundary
rect_boundary = patches.FancyBboxPatch((28, 5), 48, 90, boxstyle="round,pad=1.0", ec="#2563EB", fc="#F8FAFC", lw=2, ls="--")
ax.add_patch(rect_boundary)
ax.text(52, 91, "TripMeta Travel Platform System Boundary", ha='center', fontsize=10, fontweight='bold', color="#1E40AF")

# Actor Left: Traveler
ax.scatter([12], [65], s=250, color="#1E3A8A") # head
ax.plot([12, 12], [63, 50], color="#1E3A8A", lw=2.5) # body
ax.plot([6, 18], [57, 57], color="#1E3A8A", lw=2.5) # arms
ax.plot([12, 6], [50, 38], color="#1E3A8A", lw=2.5) # left leg
ax.plot([12, 18], [50, 38], color="#1E3A8A", lw=2.5) # right leg
ax.text(12, 33, "Traveler / Explorer\n(Registered/Guest)", ha='center', fontsize=9, fontweight='bold', color="#1E293B")

# Actor Right: Administrator
ax.scatter([88], [65], s=250, color="#065F46")
ax.plot([88, 88], [63, 50], color="#065F46", lw=2.5)
ax.plot([82, 94], [57, 57], color="#065F46", lw=2.5)
ax.plot([88, 82], [50, 38], color="#065F46", lw=2.5)
ax.plot([88, 94], [50, 38], color="#065F46", lw=2.5)
ax.text(88, 33, "System Administrator\n(Catalog Manager)", ha='center', fontsize=9, fontweight='bold', color="#1E293B")

# Use Cases (Ellipses)
use_cases = [
    ("Browse & Search Atlas\n(Filter by Mood/Category)", 52, 80, 36, 9),
    ("Input Travel Preferences\n(Budget, Duration, Season)", 52, 67, 36, 9),
    ("Compute Multi-Dimensional\nTF-IDF Recommendations", 52, 54, 36, 9),
    ("View Destination Details\n& Local Logistics", 52, 41, 36, 9),
    ("Bookmark & Save\nPreferred Destinations", 52, 28, 36, 9),
    ("Build Custom Multi-Day\nTrip Itinerary", 52, 15, 36, 9)
]

for title, x, y, w, h in use_cases:
    ellipse = patches.Ellipse((x, y), w, h, ec="#2563EB", fc="#EFF6FF", lw=1.5)
    ax.add_patch(ellipse)
    ax.text(x, y, title, ha='center', va='center', fontsize=7.8, fontweight='medium', color="#1E293B")
    # Link from Traveler
    ax.plot([18, x - w/2], [55, y], color="#94A3B8", lw=1.2, ls=":")

# Admin links to specific admin activities
ax.plot([82, 70], [55, 80], color="#10B981", lw=1.2, ls="-.")
ax.plot([82, 70], [55, 54], color="#10B981", lw=1.2, ls="-.")

plt.tight_layout()
plt.savefig('report_assets/fig_4_2_use_case.png', bbox_inches='tight', dpi=300)
plt.close()

# 2. Sequence Diagram: Recommendation Flow
fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

participants = [
    ("Traveler\n(Client User)", 10),
    ("React Frontend\n(PlanMyTrip)", 32),
    ("Express API\n(Routes/Recs)", 55),
    ("TF-IDF Engine\n(recommendationEngine)", 76),
    ("SQLite DB\n(tripmeta.db)", 93)
]

# Lifelines
for name, x in participants:
    ax.add_patch(patches.FancyBboxPatch((x-7, 88), 14, 8, boxstyle="round,pad=0.5", ec="#1E40AF", fc="#DBEAFE", lw=1.5))
    ax.text(x, 92, name, ha='center', va='center', fontsize=7.5, fontweight='bold', color="#1E40AF")
    ax.plot([x, x], [88, 10], color="#94A3B8", lw=1.2, ls="--")

messages = [
    (10, 32, 82, "1. Select budget, duration, tags & click 'Plan'"),
    (32, 55, 74, "2. POST /api/recommendations (JSON body)"),
    (55, 93, 66, "3. SELECT * FROM destinations"),
    (93, 55, 58, "4. Return 32 Destination Records"),
    (55, 76, 50, "5. rankDestinations(preferences, catalog)"),
    (76, 76, 42, "6. Vectorize TF-IDF & Cosine Sim + Penalties"),
    (76, 55, 34, "7. Return Ranked Recommendation List"),
    (55, 32, 26, "8. HTTP 200 OK (Ranked JSON results)"),
    (32, 10, 18, "9. Render recommendation cards with match %")
]

for x1, x2, y, label in messages:
    if x1 == x2: # self call
        ax.annotate('', xy=(x1+3, y-4), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color="#D97706", lw=1.5, connectionstyle="arc3,rad=-0.5"))
        ax.text(x1+4, y-2, label, fontsize=7.2, color="#92400E", fontweight='semibold')
    else:
        ax.annotate('', xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color="#1E3A8A" if x2>x1 else "#059669", lw=1.4))
        ax.text((x1+x2)/2, y+1.8, label, ha='center', fontsize=7.2, color="#1E293B", fontweight='medium')

plt.tight_layout()
plt.savefig('report_assets/fig_4_3_sequence.png', bbox_inches='tight', dpi=300)
plt.close()
print("UML Diagrams generated successfully.")
