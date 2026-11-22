import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette - Modern Engineering Theme
    BG_DARK = RGBColor(11, 19, 43)        # #0B132B
    BG_CARD = RGBColor(28, 37, 65)        # #1C2541
    ACCENT_CYAN = RGBColor(72, 202, 228)  # #48CAE4
    ACCENT_BLUE = RGBColor(0, 180, 216)   # #00B4D8
    ACCENT_GREEN = RGBColor(46, 204, 113) # #2ECC71
    ACCENT_AMBER = RGBColor(243, 156, 18) # #F39C12
    TEXT_LIGHT = RGBColor(245, 247, 250)
    TEXT_MUTED = RGBColor(160, 175, 200)

    def add_header(slide, title_text, category_text="FLOODRISE ENGINEERING PROJECT"):
        # Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()

        # Category Tag
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf = cat_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = category_text.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = ACCENT_CYAN
        p.font.name = "Segoe UI"

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf2 = title_box.text_frame
        tf2.word_wrap = True
        p2 = tf2.paragraphs[0]
        p2.text = title_text
        p2.font.size = Pt(24)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_LIGHT
        p2.font.name = "Segoe UI"

        # Accent Line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.04))
        line.fill.solid()
        line.fill.fore_color.rgb = ACCENT_BLUE
        line.line.fill.background()

    def add_card(slide, left, top, width, height, title, items, badge=""):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = BG_CARD
        card.line.color.rgb = RGBColor(40, 55, 90)
        card.line.width = Pt(1.5)

        tb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.2), Inches(width - 0.5), Inches(height - 0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_top = 0
        tf.margin_left = 0

        # Title paragraph
        p0 = tf.paragraphs[0]
        p0.text = title
        p0.font.size = Pt(16)
        p0.font.bold = True
        p0.font.color.rgb = ACCENT_CYAN
        p0.font.name = "Segoe UI"

        if badge:
            p_badge = tf.add_paragraph()
            p_badge.text = f"[{badge}]"
            p_badge.font.size = Pt(10)
            p_badge.font.bold = True
            p_badge.font.color.rgb = ACCENT_AMBER
            p_badge.space_after = Pt(8)

        for item in items:
            p = tf.add_paragraph()
            p.text = f"• {item}"
            p.font.size = Pt(12)
            p.font.color.rgb = TEXT_LIGHT
            p.font.name = "Segoe UI"
            p.space_after = Pt(6)

    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = BG_DARK
    bg1.line.fill.background()

    # Title Card Accent
    glow = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.5), Inches(10.333), Inches(4.5))
    glow.fill.solid()
    glow.fill.fore_color.rgb = BG_CARD
    glow.line.color.rgb = ACCENT_CYAN
    glow.line.width = Pt(2)

    tb1 = s1.shapes.add_textbox(Inches(1.8), Inches(1.8), Inches(9.7), Inches(3.9))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "FLOODRISE"
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN
    p.font.name = "Segoe UI"
    p.alignment = PP_ALIGN.CENTER

    p = tf1.add_paragraph()
    p.text = "3D Interactive Hydraulic Flood-Resistant House Simulator"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = TEXT_LIGHT
    p.font.name = "Segoe UI"
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(20)

    p = tf1.add_paragraph()
    p.text = "An IoT & FOG-Computing Integrated Civil-Mechanical Automation System"
    p.font.size = Pt(14)
    p.font.italic = True
    p.font.color.rgb = ACCENT_BLUE
    p.font.name = "Segoe UI"
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(25)

    p = tf1.add_paragraph()
    p.text = "Full-Stack 3D Simulation • Real-Time State Machine • Automatic Synchronized Actuation"
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_MUTED
    p.font.name = "Segoe UI"
    p.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 2: EXECUTIVE SUMMARY & PROBLEM STATEMENT
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Executive Summary & Problem Statement", "Global Context & Motivation")
    add_card(s2, 0.8, 1.8, 5.7, 5.0, "The Urban Flooding Crisis", [
        "Rising Sea Levels & Climate Change: Flash floods and rising water tables inflict >$40B annual damage globally.",
        "Static Foundations Fail: Conventional homes fixed at ground level suffer irreversible structural and interior losses.",
        "Unplanned Ingress Speed: Floodwaters frequently breach residential perimeters in minutes, before human intervention is possible.",
        "Insurance & Relocation Costs: Post-disaster recovery costs outpace proactive civil-mechanical retrofits."
    ], "THE CHALLENGE")

    add_card(s2, 6.8, 1.8, 5.7, 5.0, "The FloodRise Solution", [
        "Proactive Automatic Elevation: Automatically lifts the entire house above floodwaters upon sensor detection.",
        "Autonomous Edge Controller: Operates 24/7 without human intervention or cloud dependencies.",
        "Synchronized Hydraulic Mechanism: Four precision corner cylinders maintain structural levelness during dynamic loads.",
        "Failsafe Retraction: Automatically and safely lowers the house once flood conditions confirmed safe for 10 seconds."
    ], "THE INNOVATION")

    # =========================================================================
    # SLIDE 3: WORKING PRINCIPLE & SYSTEM ARCHITECTURE
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "System Architecture & End-to-End Workflow", "Operational Overview")
    add_card(s3, 0.8, 1.8, 3.6, 5.0, "1. Sense & Measure", [
        "Perimeter Moisture Grid: 4 conductometric sensors detect first boundary contact.",
        "Ultrasonic Level Sensor: Continuously tracks flood depth in millimeters.",
        "Threshold Activation: Triggers at h >= 0.15 m floodwater depth.",
        "FOG Preprocessing: Filters surface wave ripple to eliminate false triggers."
    ], "STEP 1")

    add_card(s3, 4.8, 1.8, 3.6, 5.0, "2. Compute & Command", [
        "Real-Time Lift Formula: Lift = max(0, Depth + Clearance - FloorElev).",
        "Target Elevation Calc: Maintains 0.50 m clearance above moving water.",
        "Stroke Clamping: Enforces physical safety limit at 2.00 m stroke.",
        "Pump Manifold Relay: Activates high-pressure hydraulic pump."
    ], "STEP 2")

    add_card(s3, 8.8, 1.8, 3.6, 5.0, "3. Actuate & Protect", [
        "Synchronized Actuation: 4 corner cylinders extend at 0.15 m/s in lockstep.",
        "Rigid Platform Transfer: House foundation remains perfectly horizontal.",
        "Hold in Elevation: Stays elevated during flood crest and turbulence.",
        "Hysteresis Lowering: Smooth 0.10 m/s descent after 10s confirmed dry period."
    ], "STEP 3")

    # =========================================================================
    # SLIDE 4: MECHANICAL HYDRAULIC SYSTEM SPECIFICATIONS
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Mechanical Actuation & Hydraulic System", "Subsystem Deep-Dive")
    add_card(s4, 0.8, 1.8, 5.7, 5.0, "Hydraulic Cylinder Specifications", [
        "Actuator Configuration: 4 double-acting telescopic cylinders at corners.",
        "Outer Cylinder Body: 240 mm diameter heavy-wall alloy steel casing.",
        "Piston Rod: 140 mm hard-chrome plated high-tensile steel piston.",
        "Maximum Stroke: 2.00 metres continuous lift capability.",
        "Lifting Rate: Controlled 0.15 m/s extension, 0.10 m/s descent rate.",
        "Mounting: Reinforced base anchor plates with spherical swivel brackets to accommodate micro-flexure."
    ], "CYLINDERS")

    add_card(s4, 6.8, 1.8, 5.7, 5.0, "Pumping & Fluid Distribution", [
        "Hydraulic Pump Unit: High-pressure electric motor gear pump.",
        "Fluid Reservoir: 150-liter ISO VG 46 mineral oil fluid tank with sight glass.",
        "Manifold Piping Network: Equalized rigid feed lines supplying all corners simultaneously to maintain pressure parity.",
        "Proportional Flow Valves: Compensate for uneven residential load distributions.",
        "Lock Valves: Integrated pilot check valves prevent accidental depressurization drop even during power outage."
    ], "HYDRAULIC CIRCUIT")

    # =========================================================================
    # SLIDE 5: SENSOR NETWORK & TELEMETRY
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Multi-Sensor Detection & Depth Telemetry", "Perception Subsystem")
    add_card(s5, 0.8, 1.8, 5.7, 5.0, "Perimeter Moisture Array", [
        "4-Point Quadrant Layout: Sensor 1 (North), Sensor 2 (South), Sensor 3 (East), Sensor 4 (West).",
        "Conductivity Ingress Probes: Detect instantaneous water bridging at 0.15 m.",
        "Visual 3D Status LED: Real-time Green (Dry/Normal), Red (Water Contact), Orange (Severe Warning).",
        "Redundancy Logic: Multi-sensor voting confirms flood direction and validates event before actuation."
    ], "PERIMETER SENSORS")

    add_card(s5, 6.8, 1.8, 5.7, 5.0, "Continuous Water Depth Sensor", [
        "Ultrasonic / Hydrostatic Transducer: Measures simulated floodwater depth from 0.00 to 3.00 metres.",
        "Graduated Virtual Staff: 3D reference pole with calibrated marks at 0.50m intervals.",
        "Dynamic Dynamic Sampling: Real-time telemetry feed updating at 30 Hz simulation clock.",
        "Signal Smoothing: Low-pass filter eliminates wave motion ripple from lifting target calculation."
    ], "DEPTH TELEMETRY")

    # =========================================================================
    # SLIDE 6: MATHEMATICAL CONTROL FORMULATION
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Control Algorithm & Mathematical Formulation", "Engineering Logic")
    add_card(s6, 0.8, 1.8, 5.7, 5.0, "Target Elevation Formulation", [
        "Governing Elevation Equation:",
        "    L_req = max(0, d_flood + C_desired - h_floor)",
        "Where:",
        "    • d_flood = Real-time measured floodwater depth (m)",
        "    • C_desired = Desired structural clearance (0.50 m)",
        "    • h_floor = Initial vulnerable floor height (0.45 m)",
        "Stroke Clamping Boundary:",
        "    L_target = min(L_req, L_max_stroke) [L_max = 2.00 m]",
        "Guarantees the house maintains safe clearance without overextending actuators."
    ], "MATHEMATICAL MODEL")

    add_card(s6, 6.8, 1.8, 5.7, 5.0, "Kinematics & Rate Limiting", [
        "Synchronous Motion Equation:",
        "    dy/dt = +v_lift (0.15 m/s) when y < L_target",
        "    dy/dt = -v_lower (0.10 m/s) when y > L_target",
        "Fixed-Timestep Simulation: 30 Hz discrete time integration dt = 0.0333s.",
        "Anti-Teleport Interpolation: Realistic physical mass acceleration prevents instantaneous jumping.",
        "Levelness Invariant: All 4 actuators follow: y_FL = y_FR = y_RL = y_RR = y_platform."
    ], "KINEMATICS")

    # =========================================================================
    # SLIDE 7: FINITE STATE MACHINE (FSM)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Finite State Machine & Operational Modes", "Control Architecture")
    add_card(s7, 0.8, 1.8, 5.7, 5.0, "The 9 Operational States", [
        "1. IDLE: Standby resting at ground level (0 m).",
        "2. MONITORING: Sensors active, polling water levels.",
        "3. FLOOD_DETECTED: Perimeter breached (>= 0.15 m).",
        "4. LIFTING: Pump running, pistons actively extending.",
        "5. ELEVATED: Target clearance achieved and maintained.",
        "6. WATER_RECEDING: Water retreating below safe threshold.",
        "7. LOWERING: Safe confirmation passed, controlled descent.",
        "8. MAXIMUM_LIFT_REACHED: Actuators extended to 2.00 m cap.",
        "9. EMERGENCY: Water exceeds lifting capacity (> 2.45 m)."
    ], "FINITE STATE MACHINE")

    add_card(s7, 6.8, 1.8, 5.7, 5.0, "Operating Modes & Overrides", [
        "AUTOMATIC MODE:",
        "    Fully autonomous closed-loop operation driven by sensor input and safety state machine.",
        "MANUAL OVERRIDE MODE:",
        "    Allows maintenance operator to manually step lifting and lowering via dashboard UI.",
        "HARDWARE SAFETY INTERLOCK:",
        "    Manual lower commands are strictly locked out if floodwater depth >= 0.10 m.",
        "INDIVIDUAL SENSOR TEST:",
        "    Diagnostic toggling to independently verify N/S/E/W sensor channels."
    ], "OPERATING MODES")

    # =========================================================================
    # SLIDE 8: SAFETY ENGINEERING & HYSTERESIS
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Safety Engineering, Hysteresis & Failsafes", "Risk Mitigation")
    add_card(s8, 0.8, 1.8, 5.7, 5.0, "Safety Hysteresis Window", [
        "Anti-Hunting Problem: Wave ripples or brief water drops could trigger premature, dangerous house lowering.",
        "10-Second Confirmation Window: Water must continuously remain below 0.10 m for 10 simulated seconds before LOWERING state engages.",
        "Automatic Timer Reset: Any transient wave surge > 0.10 m immediately resets the timer to 0 and re-engages ELEVATED hold.",
        "Dual-Threshold Strategy: Trigger threshold (0.15 m) is higher than reset threshold (0.10 m) to prevent cyclic oscillation."
    ], "HYSTERESIS")

    add_card(s8, 6.8, 1.8, 5.7, 5.0, "Emergency & Failsafe Protocols", [
        "Flood Over-Capacity Alert: When flood depth exceeds maximum lift + floor level (2.45 m), flashing EMERGENCY banner alerts occupants.",
        "Mechanical Pilot Check Valves: Cylinders lock in place hydraulically even if electrical pump power drops completely.",
        "Load Distribution Compensation: Manifold distributes uniform pressure regardless of interior room furniture weight variations.",
        "Hydraulic Health Telemetry: Dashboard continuously tracks pump integrity and hydraulic health index (100%)."
    ], "FAILSAFES")

    # =========================================================================
    # SLIDE 9: THE 10-PHASE AUTOMATIC DEMONSTRATION
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "The 10-Phase Automated Demo Lifecycle", "Demonstration Walkthrough")
    add_card(s9, 0.8, 1.8, 3.6, 5.0, "Phases 1 to 4: Detection", [
        "Phase 1 (t=0s): Normal baseline, dry foundation, all cylinders retracted.",
        "Phase 2 (t=3s): Ingress starts, water reaches 0.10 m around site.",
        "Phase 3 (t=8s): Sensors trip at 0.25 m, LED turns red, event logged.",
        "Phase 4 (t=12s): FOG controller calculates initial required lift (0.30 m)."
    ], "DETECTION")

    add_card(s9, 4.8, 1.8, 3.6, 5.0, "Phases 5 to 7: Protection", [
        "Phase 5 (t=15s): Hydraulic pump starts, animated oil flows through piping.",
        "Phase 6 (t=20s): Cylinders extend upward, house and platform rise in sync.",
        "Phase 7 (t=28s): Flood reaches 1.10 m, house remains safe with 0.50 m clearance."
    ], "LIFTING")

    add_card(s9, 8.8, 1.8, 3.6, 5.0, "Phases 8 to 10: Recovery", [
        "Phase 8 (t=38s): Water recedes, drops below safe threshold (0.05 m).",
        "Phase 9 (t=55s): Safe confirmation period verified, controlled descent starts.",
        "Phase 10 (t=75s): House safely returns to ground level; system normal."
    ], "RECOVERY")

    # =========================================================================
    # SLIDE 10: 3D GRAPHICS & VISUALIZATION PIPELINE
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "3D Visualization & Digital Twin Engineering", "Graphics Subsystem")
    add_card(s10, 0.8, 1.8, 5.7, 5.0, "Three.js & R3F Rendering Pipeline", [
        "Full 3D Procedural Architecture: Two-storey house, balconies, roof truss, and structural foundation.",
        "Hydraulic Components: Detailed cylinder barrels, gleaming metallic pistons, port manifolds, and animated pump impeller.",
        "Real-Time Wave Simulation: Dynamic semi-transparent water surface with sine wave modulation and time-offset shaders.",
        "Lighting & Shadows: Directional sunlight with PCFSoftShadowMap, ambient skylight, and ground grid reference plane."
    ], "GRAPHICS PIPELINE")

    add_card(s10, 6.8, 1.8, 5.7, 5.0, "Inspection & Camera Features", [
        "3 Camera Presets: Default Perspective view, Orthogonal Side/Elevation view, and Top-Down site map.",
        "Full OrbitControls: 360-degree rotation, mouse scroll zoom (3m to 40m range), and right-click panning.",
        "X-Ray / Inspection Mode: Toggles house superstructure to semi-transparent so internal cylinders and attachments are visible.",
        "Integrated Head-Up Display (HUD): Instant numeric overlay for flood depth, house elevation, and piston extension."
    ], "USER INTERACTION")

    # =========================================================================
    # SLIDE 11: SOFTWARE ARCHITECTURE & TECH STACK
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "Software Architecture & Technology Stack", "Implementation")
    add_card(s11, 0.8, 1.8, 5.7, 5.0, "Core Technology Stack", [
        "Frontend Framework: React 19 with strict TypeScript type safety.",
        "3D Engine: Three.js paired with React Three Fiber (R3F) and React Three Drei helpers.",
        "Live Telemetry Graphs: Recharts interactive time-series monitoring graph.",
        "Styling & Design System: Dark engineering laboratory theme with responsive flex layout.",
        "Build System & Bundler: Vite 8 for sub-second hot module reloading and optimized production bundles."
    ], "TECH STACK")

    add_card(s11, 6.8, 1.8, 5.7, 5.0, "Modular Code Architecture", [
        "/src/types/simulation.ts: Strict interfaces for simulation states, sensors, and actuators.",
        "/src/simulation/SimulationEngine.ts: Pure, decoupled physics and state machine without 3D dependencies.",
        "/src/simulation/DemoSequencer.ts: 10-step automated script manager.",
        "/src/components/3d/: Isolated 3D visual models (Cylinders, Pump, Pipes, Sensors, Water).",
        "/src/components/: TelemetryDashboard, ControlPanel, FloodChart, and EventTimeline."
    ], "CODE STRUCTURE")

    # =========================================================================
    # SLIDE 12: REAL-WORLD ENGINEERING FEASIBILITY
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "Civil & Mechanical Engineering Feasibility", "Real-World Application")
    add_card(s12, 0.8, 1.8, 5.7, 5.0, "Structural & Load Calculations", [
        "Typical 2-Storey Modular House Mass: ~40 to 60 tonnes (approx. 400 - 600 kN total weight).",
        "Load per Corner Actuator: ~100 to 150 kN load capacity required.",
        "Hydraulic Pressure Calculation: At 140 mm piston diameter (A = 0.0154 m^2), required operating pressure is ~100 bar (1,450 psi).",
        "Off-the-Shelf Commercial Equipment: Standard industrial hydraulic cylinders easily handle 200 - 300 bar, providing a 2x+ safety factor.",
        "Power Backup: 15 kW standby battery/generator system ensures operation during grid blackout."
    ], "ENGINEERING SPECS")

    add_card(s12, 6.8, 1.8, 5.7, 5.0, "Comparative Technology Benchmark", [
        "FloodRise Hydraulic vs. Static Stilts: Avoids high daily stairs; normal streetscape appearance during dry months.",
        "FloodRise vs. Amphibious Buoyancy: Buoyant houses can drift or tilt during currents; hydraulic rams provide rigid lateral anchoring.",
        "FloodRise vs. Temporary Sandbags: Zero manual labor, zero reaction delay, and no disposal waste.",
        "Return on Investment (ROI): Single flood event avoidance recoups installation cost by preventing total loss of ground floor."
    ], "BENCHMARK")

    # =========================================================================
    # SLIDE 13: SMART CITY & FOG COMPUTING EXTENSIONS
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    add_header(s13, "Future Scope & Smart City Integration", "FOG & IoT Vision")
    add_card(s13, 0.8, 1.8, 5.7, 5.0, "FOG / Edge Computing Capabilities", [
        "Local Edge Autonomy: The house does not rely on cloud latency; FOG computing processes all sensor signals locally on the site.",
        "Mesh Network Collaboration: Neighboring FloodRise houses share early-warning flood boundary telemetry over LoRa mesh.",
        "AI Predictive Ingress Forecasting: Machine learning models predict crest arrival time from upstream river sensors.",
        "Utility Auto-Shutoff: Edge controller automatically closes natural gas mains and disconnects municipal grid power prior to elevation."
    ], "FOG COMPUTING")

    add_card(s13, 6.8, 1.8, 5.7, 5.0, "Smart City Infrastructure Links", [
        "Municipal Flood SCADA Sync: Transmits neighborhood flood depth metrics back to city emergency response departments.",
        "Stormwater Drainage Feedback: Coordinates localized detention basin releases.",
        "Solar Microgrid Power: Integrated rooftop solar and energy storage guarantees indefinite elevated hold during prolonged storms.",
        "Commercial Retrofit: Architecture scales to schools, hospitals, substations, and commercial logistics hubs."
    ], "SMART CITIES")

    # =========================================================================
    # SLIDE 14: CONCLUSION & PROJECT DELIVERABLES
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    add_header(s14, "Conclusion & Project Deliverables", "Project Summary")
    add_card(s14, 0.8, 1.8, 5.7, 5.0, "Key Deliverables Completed", [
        "Fully Interactive 3D Simulation: Modern house, visible 4-cylinder hydraulic mechanism, animated pump and floodwater.",
        "Authentic Engineering State Machine: 9 state transitions, hysteresis timing, and safety locking logic.",
        "Professional Control Dashboard: Scenarios, manual controls, telemetry, live charts, and event timeline.",
        "10-Phase Automatic Demonstration: Complete showcase executed at the touch of a single button.",
        "Deployment Ready: Fully bundled, open-sourced on GitHub, and prepared for Vercel cloud deployment."
    ], "DELIVERABLES")

    add_card(s14, 6.8, 1.8, 5.7, 5.0, "Repository & Demonstration Links", [
        "GitHub Repository:",
        "    https://github.com/Abhishek14411/FOG-based-FLOODRISE-house-simulation.git",
        "Local Live Application:",
        "    http://localhost:5173",
        "Technologies Used:",
        "    React 19, TypeScript, Vite, Three.js, R3F, Drei, Recharts",
        "Target Audience:",
        "    Civil, Mechanical, Mechatronics, and IoT Engineering Presentations."
    ], "ACCESS LINKS")

    output_path = r"C:\Users\kypma\floodrise\FLOODRISE_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_deck()
