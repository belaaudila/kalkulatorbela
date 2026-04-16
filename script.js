const screen = document.getElementById('screen');
const iconResult = document.getElementById('iconResult');

// Fungsi navigasi tab
function showPanel(type) {
    const calcP = document.getElementById('calcPanel');
    const storyP = document.getElementById('storyPanel');
    const btnC = document.getElementById('btnCalc');
    const btnS = document.getElementById('btnStory');

    if(type === 'calc') {
        calcP.style.display = 'grid';
        storyP.style.display = 'none';
        btnC.classList.add('active');
        btnS.classList.remove('active');
    } else {
        calcP.style.display = 'none';
        storyP.style.display = 'flex';
        btnC.classList.remove('active');
        btnS.classList.add('active');
    }
}

// Fungsi input angka/operator
function append(val) {
    if (screen.innerText === '0' && val !== '.' && !val.includes('Math')) {
        screen.innerText = val;
    } else {
        screen.innerText += val;
    }
}

// Hapus layar
function clearScreen() { 
    screen.innerText = '0'; 
}

// Ubah tanda (+/-)
function toggleSign() { 
    if(screen.innerText !== '0') {
        screen.innerText = parseFloat(screen.innerText) * -1; 
    }
}

// Kalkulasi hasil manual
function calculate() {
    try {
        let expression = screen.innerText;
        
        let openBrackets = (expression.match(/\(/g) || []).length;
        let closeBrackets = (expression.match(/\)/g) || []).length;
        while(openBrackets > closeBrackets) {
            expression += ')';
            closeBrackets++;
        }
        
        let res = eval(expression);
        screen.innerText = Number.isInteger(res) ? res : res.toFixed(4);
    } catch {
        screen.innerText = "Error";
        setTimeout(clearScreen, 1500);
    }
}

// --- LOGIKA PENYELESAIAN SOAL CERITA & IDENTITAS ---
function solveStory() {
    const storyInput = document.getElementById('storyInput');
    const text = storyInput.value.toLowerCase();
    
    const modal = document.getElementById('resultModal');
    const modalText = document.getElementById('modalText');
    
    let finalAnswer = "";
    let isIdentityRequest = false;

    // 1. Cek Pertanyaan Identitas
    if (text.includes("siapa namamu") || text.includes("siapa nama anda")) {
        finalAnswer = "Bela Syakila & Mifta";
        isIdentityRequest = true;
    } 
    // 2. Cek Logika Matematika
    else {
        const nums = text.match(/\d+(\.\d+)?/g);

        if (!nums || nums.length < 2) {
            alert("Masukkan soal cerita matematika atau tanya 'Siapa namamu?'");
            return;
        }

        const a = parseFloat(nums[0]);
        const b = parseFloat(nums[1]);
        let result = 0;

        if (text.includes("bagi") || text.includes("rata") || text.includes(":") || text.includes("/")) {
            result = a / b;
        } else if (text.includes("kali") || text.includes("x") || text.includes("*") || text.includes("setiap")) {
            result = a * b;
        } else if (text.includes("kurang") || text.includes("sisa") || text.includes("selisih") || text.includes("-")) {
            result = a - b;
        } else {
            result = a + b;
        }
        
        finalAnswer = Number.isInteger(result) ? result : result.toFixed(2);
    }

    // TAMPILAN MODAL (Identitas & Jawaban)
    modalText.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px;">
            <small style="color: var(--accent); letter-spacing: 2px; font-weight: bold;">Hasil Perhitungan Bela Syakila & Mifta</small>
        </div>
        <div style="background: rgba(231, 209, 209, 0.05); padding: 15px; border-radius: 12px; border-left: 4px solid #f0badf; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 12px; color: #121316; text-transform: uppercase;">Pertanyaan:</p>
            <p style="margin: 5px 0 0 0; font-style: italic; color: var(--white); font-size: 14px;">"${storyInput.value}"</p>
        </div>
        <div style="text-align: center;">
            <p style="font-size: 14px; margin-bottom: 8px; color: var(--white);">Jawaban:</p>
            <div style="font-size: 40px; color: #1a1719; font-weight: bold; text-shadow: 0 0 15px rgba(100, 255, 218, 0.4);">
                ${finalAnswer}
            </div>
        </div>
    `;
    
    modal.style.display = "flex";

    // Simpan di icon sebagai cadangan
    iconResult.setAttribute('data-answer', finalAnswer);
    iconResult.classList.add('has-answer'); 
}

// Fungsi untuk menutup modal
function closeModal() {
    document.getElementById('resultModal').style.display = "none";
}

// Menutup modal jika user klik di luar kotak modal
window.onclick = function(event) {
    const modal = document.getElementById('resultModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Memindahkan hasil dari icon ke layar utama
function applyFromIcon() {
    const answer = iconResult.getAttribute('data-answer');
    if (answer) {
        screen.innerText = answer;
        iconResult.classList.remove('has-answer'); 
        iconResult.removeAttribute('data-answer'); 
        showPanel('calc'); 
    } else {
        alert("Belum ada jawaban yang tersimpan.");
    }
}
