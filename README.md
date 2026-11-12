# Professional Skills Executive Portfolio (Creative Studio Edition) 🎓💻✨
**Faculty of Information Technology**
**Student: L.S.T Ekanayaka (SA25610207)**

---

## ✏️ නම, Student ID සහ ඕනෑම විස්තරයක් HTML මගින් වෙනස් කරන්නේ කෙසේද?

දැන් Website එකෙහි **සියලුම නම්, Student ID, සහ විස්තර 100% ක්ම `index.html` file එකෙන් සෘජුවම පාලනය වේ**. JavaScript (JS) මගින් කිසිදු text එකක් override කරන්නේ හෝ සඟවන්නේ නැත!

ඔබට නම හෝ විස්තර වෙනස් කිරීමට අවශ්‍ය නම්:
1. `index.html` file එක Text Editor එකකින් (Notepad, VS Code ආදී) open කරන්න.
2. පහත පේළි සොයා ඔබට අවශ්‍ය නම හෝ ID එක Type කර **Save (`Ctrl + S`)** කරන්න:
   - **ප්‍රධාන විශාල නම (Hero Headline):**
     ```html
     <h1 class="hero-giant-name">
       <span>L.S.T Ekanayaka</span>
     </h1>
     ```
   - **Avatar Card එකේ නම සහ Initials:**
     ```html
     <div class="avatar-initials-badge">LE</div>
     <strong style="font-size: 0.95rem; letter-spacing: -0.01em;">L.S.T Ekanayaka</strong>
     ```
   - **Student ID එක:**
     ```html
     <span class="social-pill-badge" id="studentIdBadge">SA25610207</span>
     ```
   - **පහළම ඇති Acknowledgement Signature නම:**
     ```html
     <div style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; color: #ffffff;">L.S.T Ekanayaka</div>
     ```
3. Browser එකට ගොස් **Refresh (`Ctrl + F5` හෝ `F5`)** කළ සැනින් ඔබ HTML හි කළ වෙනස්කම් ඒ අයුරින්ම ක්ෂණිකව දිස්වේ!

---

## 📸 ඡායාරූප (Images) ඇතුළත් කිරීම:
1. **Direct In-Browser Upload:** Website එක Browser එකෙන් open කර, ඕනෑම Lesson Card එකක ඇති **"Choose Photo"** button එක click කර ඔබේ පරිගණකයේ ඇති photo එකක් select කරන්න.
2. **`images/` Folder මගින්:** `images/` folder එක තුළට `ch01-johari.jpg`, `card-wip.jpg`, `card-final.jpg`, `card-team.jpg`, `ch03-interview.jpg`, `ws-team.jpg` ආදී නම්වලින් photos paste කරන්න.
