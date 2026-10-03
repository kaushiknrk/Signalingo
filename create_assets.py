import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SIGNS_DIR = os.path.join(BASE_DIR, "frontend", "public", "assets", "signs")
AVATARS_DIR = os.path.join(BASE_DIR, "frontend", "public", "assets", "avatars")
HERO_DIR = os.path.join(BASE_DIR, "frontend", "public", "assets", "hero")

os.makedirs(SIGNS_DIR, exist_ok=True)
os.makedirs(AVATARS_DIR, exist_ok=True)
os.makedirs(HERO_DIR, exist_ok=True)

# Colors
TURQUOISE = "#00A896"
YELLOW = "#FFB703"
DARK_BLUE = "#0F172A"
WARM_BG = "#F8FAF9"

def generate_sign_svg(char_or_word):
    is_word = len(char_or_word) > 1
    display_title = char_or_word.upper()
    bg_gradient_start = "#00A896" if not is_word else "#02C39A"
    bg_gradient_end = "#007A6E" if not is_word else "#00A896"
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{bg_gradient_start}" />
      <stop offset="100%" stop-color="{bg_gradient_end}" />
    </linearGradient>
    <linearGradient id="handGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFD166" />
      <stop offset="100%" stop-color="#FFB703" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#0F172A" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Card Background -->
  <rect width="400" height="400" rx="32" fill="url(#bgGrad)" />
  <circle cx="200" cy="180" r="130" fill="#FFFFFF" opacity="0.12" />
  
  <!-- Outer Ring Accent -->
  <circle cx="200" cy="180" r="100" stroke="#FFB703" stroke-width="6" fill="none" stroke-dasharray="12 8" opacity="0.75" />

  <!-- Stylized ASL Hand Shape Vector -->
  <g filter="url(#shadow)" transform="translate(110, 80)">
    <!-- Palm / Base Wrist -->
    <path d="M 50 170 C 40 140 35 110 40 70 C 45 40 70 30 90 30 C 110 30 135 40 140 70 C 145 110 140 140 130 170 Z" fill="url(#handGrad)" stroke="{DARK_BLUE}" stroke-width="4" stroke-linejoin="round"/>
    
    <!-- Fingers / Knuckles Gesture -->
    <rect x="50" y="45" width="18" height="55" rx="9" fill="#FFE29A" stroke="{DARK_BLUE}" stroke-width="3" />
    <rect x="72" y="32" width="18" height="65" rx="9" fill="#FFE29A" stroke="{DARK_BLUE}" stroke-width="3" />
    <rect x="94" y="38" width="18" height="60" rx="9" fill="#FFE29A" stroke="{DARK_BLUE}" stroke-width="3" />
    <rect x="116" y="52" width="16" height="48" rx="8" fill="#FFE29A" stroke="{DARK_BLUE}" stroke-width="3" />
    
    <!-- Thumb -->
    <path d="M 35 110 C 20 95 30 75 55 85 C 65 90 65 115 50 125 Z" fill="#FFB703" stroke="{DARK_BLUE}" stroke-width="3" />
    
    <!-- Wrist cuff detailing -->
    <path d="M 45 160 Q 90 175 135 160" fill="none" stroke="{DARK_BLUE}" stroke-width="4" stroke-linecap="round"/>
  </g>

  <!-- Bottom Character Label Badge -->
  <rect x="40" y="310" width="320" height="60" rx="20" fill="{DARK_BLUE}" opacity="0.95"/>
  <text x="200" y="352" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="{ '24' if is_word else '32' }" fill="#FFB703" text-anchor="middle" letter-spacing="2">
    {display_title}
  </text>
</svg>'''
    return svg

def generate_hero_student_svg():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00A896" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFB703" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <filter id="heroShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Outer Circle Frame -->
  <circle cx="300" cy="300" r="260" fill="url(#heroBg)" />
  <circle cx="300" cy="300" r="240" stroke="#FFB703" stroke-width="4" fill="none" stroke-dasharray="16 12" opacity="0.6"/>

  <!-- Floating ASL Sign Orbs -->
  <g filter="url(#heroShadow)">
    <circle cx="110" cy="140" r="45" fill="#FFB703"/>
    <text x="110" y="152" font-family="sans-serif" font-size="32" font-weight="bold" fill="#0F172A" text-anchor="middle">🤟</text>
    
    <circle cx="490" cy="150" r="45" fill="#00A896"/>
    <text x="490" y="162" font-family="sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF" text-anchor="middle">✋</text>

    <circle cx="480" cy="450" r="40" fill="#FFB703"/>
    <text x="480" y="462" font-family="sans-serif" font-size="28" font-weight="bold" fill="#0F172A" text-anchor="middle">👌</text>
  </g>

  <!-- Friendly Student Character Avatar -->
  <g filter="url(#heroShadow)" transform="translate(150, 120)">
    <!-- Shoulders / Sweater -->
    <path d="M 20 320 C 30 230 270 230 280 320 L 280 360 L 20 360 Z" fill="url(#yellowGrad)" />
    
    <!-- Neck -->
    <rect x="125" y="195" width="50" height="50" fill="#FFD166" rx="10"/>
    
    <!-- Head -->
    <circle cx="150" cy="130" r="75" fill="#FFE29A"/>
    
    <!-- Hair -->
    <path d="M 75 120 C 70 50 230 50 225 120 C 200 80 100 80 75 120 Z" fill="#0F172A"/>

    <!-- Happy Eyes & Smile -->
    <circle cx="125" cy="125" r="8" fill="#0F172A"/>
    <circle cx="175" cy="125" r="8" fill="#0F172A"/>
    <path d="M 125 155 Q 150 180 175 155" stroke="#0F172A" stroke-width="5" fill="none" stroke-linecap="round"/>
    
    <!-- Cheeks -->
    <circle cx="110" cy="140" r="10" fill="#FF8A8A" opacity="0.6"/>
    <circle cx="190" cy="140" r="10" fill="#FF8A8A" opacity="0.6"/>

    <!-- Hand Signing 'I LOVE YOU' (ASL) -->
    <g transform="translate(200, 160)">
      <path d="M 20 70 C 10 30 40 10 60 40 C 70 20 90 20 95 45 C 100 70 80 100 50 110 Z" fill="#FFD166" stroke="#0F172A" stroke-width="4"/>
    </g>
  </g>
</svg>'''
    return svg

def generate_avatar_svg(name, color):
    first_char = name[0].upper()
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="{color}" />
  <circle cx="60" cy="60" r="50" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.4"/>
  <text x="60" y="75" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="44" fill="#0F172A" text-anchor="middle">
    {first_char}
  </text>
</svg>'''
    return svg

# Write Alphabet Signs A-Z
alphabets = [chr(i) for i in range(ord('A'), ord('Z') + 1)]
for char in alphabets:
    filepath = os.path.join(SIGNS_DIR, f"{char.lower()}.svg")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(generate_sign_svg(char))

# Write Words
words = ["hello", "yes", "no", "thank_you", "please", "goodbye", "love", "help"]
for w in words:
    filepath = os.path.join(SIGNS_DIR, f"{w}.svg")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(generate_sign_svg(w.replace('_', ' ')))

# Write Hero Student Image
hero_path = os.path.join(HERO_DIR, "student_illustration.svg")
with open(hero_path, "w", encoding="utf-8") as f:
    f.write(generate_hero_student_svg())

# Write Avatars
with open(os.path.join(AVATARS_DIR, "gowri.svg"), "w", encoding="utf-8") as f:
    f.write(generate_avatar_svg("Gowri", "#FFB703"))

with open(os.path.join(AVATARS_DIR, "priya.svg"), "w", encoding="utf-8") as f:
    f.write(generate_avatar_svg("Priya", "#00A896"))

with open(os.path.join(AVATARS_DIR, "admin.svg"), "w", encoding="utf-8") as f:
    f.write(generate_avatar_svg("Admin", "#0F172A"))

print("All visual SVG sign illustrations, avatars, and login student hero assets generated successfully!")
