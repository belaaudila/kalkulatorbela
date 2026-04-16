const screen = document.getElementById('screen');
const iconResult = document.getElementById('iconResult');

// Fungsi untuk beralih antara Kalkulator dan Soal Cerita
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

// Menambahkan angka atau operator ke layar
function append(val) {
    if (screen.innerText === '0' && val !== '.' && !val.includes('Math')) {
        screen.innerText = val;
    } else {
        screen.innerText += val;
    }
}

// Menghapus layar
function clearScreen() { 
    screen.innerText = '0'; 
}

// Mengubah tanda positif/negatif
function toggleSign() { 
    if(screen.innerText !== '0') {
        screen.innerText = parseFloat(screen.innerText) * -1; 
    }
}

// Menghitung hasil matematika
function calculate() {
    try {
        let expression = screen.innerText;
        // Otomatis menutup kurung yang kurang
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

// Logika sederhana untuk memproses soal cerita
function solveStory() {
    const text = document.getElementById('storyInput').value.toLowerCase();
    const nums = text.match(/\d+(\.\d+)?/g);

    if (!nums || nums.length < 2) {
        alert("Masukkan soal dengan minimal 2 angka!");
        return;
    }

    const a = parseFloat(nums[0]);
    const b = parseFloat(nums[1]);
    let result = 0;

    if (text.includes("tambah") || text.includes("dan") || text.includes("beli") || text.includes("total")) {
        result = a + b;
    } else if (text.includes("kurang") || text.includes("sisa") || text.includes("kasih") || text.includes("berikan")) {
        result = a - b;
    } else if (text.includes("kali") || text.includes("setiap")) {
        result = a * b;
    } else if (text.includes("bagi") || text.includes("rata")) {
        result = a / b;
    } else {
        result = a + b; // Default ke tambah
    }

    // SIMPAN JAWABAN DI ICON ATAS
    iconResult.setAttribute('data-answer', result);
    iconResult.classList.add('has-answer'); // Aktifkan animasi pulse
    
    alert("Bela, Syakila & Mifta sudah menghitung! Klik icon keyboard di pojok kanan atas untuk melihat hasilnya. 😉");
}


// Mengambil jawaban dari icon dan menampilkannya di layar kalkulator
function applyFromIcon() {
    const answer = iconResult.getAttribute('data-answer');
    if (answer) {
        screen.innerText = answer;
        iconResult.classList.remove('has-answer'); // Matikan animasi
        iconResult.removeAttribute('data-answer'); // Bersihkan data agar tidak duplikat
        showPanel('calc'); // Pindah otomatis ke tab kalkulator
    } else {
        alert("Belum ada jawaban soal cerita yang tersimpan.");
    }
}