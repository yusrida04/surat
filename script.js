const envelopes = document.querySelectorAll('.envelope-wrapper');
        const overlay = document.querySelector('.overlay');
        const letters = document.querySelectorAll('.letter-modal');
        const closingSection = document.querySelector('.closing-section');
        
        const modalCloseBtns = document.querySelectorAll('.letter-modal .close-btn');
        const closingCloseBtn = document.querySelector('.closing-close-btn');

        // NILAI DURASI (sesuai dengan CSS)
        const ENVELOPE_OPEN_DURATION = 500; 
        const PAPER_TRANSITION_DURATION = 400; 
        
        let activeEnvelope = null;
        let isAnimating = false; 

        function checkAllRead(){
            return Array.from(envelopes).every(env => env.classList.contains('read'));
        }
        
        // FUNGSI BARU: Untuk memperbarui teks status di bawah judul
function updateReadStatus() {
    const totalEnvelopes = envelopes.length;
    // Menghitung berapa banyak amplop yang memiliki kelas 'read'
    const readEnvelopes = document.querySelectorAll('.envelope-wrapper.read').length;
    const statusElement = document.getElementById('read-status');

    if (statusElement) {
        statusElement.textContent = `Status: ${readEnvelopes} dari ${totalEnvelopes} Surat telah Dibaca`;
    }
}

// FUNGSI closeLetter() YANG DIMODIFIKASI
// FUNGSI BARU: Untuk memperbarui teks status di bawah judul
function updateReadStatus() {
    const totalEnvelopes = envelopes.length;
    // Menghitung berapa banyak amplop yang memiliki kelas 'read'
    const readEnvelopes = document.querySelectorAll('.envelope-wrapper.read').length;
    const statusElement = document.getElementById('read-status');

    if (statusElement) {
        statusElement.textContent = `Status: ${readEnvelopes} dari ${totalEnvelopes} Surat telah Dibaca`;
    }
}

// FUNGSI closeLetter() YANG DIMODIFIKASI
function closeLetter(){
    // 1. Blokir interaksi lain
    isAnimating = true; 
    
    // 2. Tutup Modal & Overlay
    document.body.style.overflow = '';
    letters.forEach(l => l.classList.remove('active'));
    overlay.classList.remove('active');
    
    const currentEnvelope = activeEnvelope;
    activeEnvelope = null; 

    if (currentEnvelope) {
        // 3. Mulai Animasi Kertas Masuk (class 'closing')
        currentEnvelope.classList.add('closing');
        
        // 4. Tunggu Kertas Masuk selesai (PAPER_TRANSITION_DURATION)
        setTimeout(() => {
            // 5. Tutup Flap (hapus class 'opening')
            currentEnvelope.classList.remove('opening');
            
            // 6. Tunggu Animasi Flap Menutup (ENVELOPE_OPEN_DURATION)
            setTimeout(() => {
                currentEnvelope.classList.remove('closing');
                
                // 7. UNBLOCK KLIK di sini, karena amplop sudah tertutup
                isAnimating = false;
                
                // 8. Panggil fungsi update status setelah animasi selesai
                updateReadStatus(); 

                // 9. Cek & Tampilkan Closing Section HANYA setelah animasi selesai
                if (checkAllRead()) {
                    closingSection.classList.add('active');
                }
            }, ENVELOPE_OPEN_DURATION); 

        }, PAPER_TRANSITION_DURATION);
    } else {
        isAnimating = false;
    }
}
        function openLetter(envelopeElement) {
            if (closingSection.classList.contains('active') || isAnimating) return; 

            isAnimating = true;

            activeEnvelope = envelopeElement; 
            
            const letterType = envelopeElement.getAttribute('data-letter');
            const letter = document.getElementById('letter-' + letterType);

            envelopeElement.classList.remove('closing');
            envelopeElement.classList.add('opening');
            
            if (!envelopeElement.classList.contains('read')) {
                envelopeElement.classList.add('read');
            }
            
            setTimeout(() => {
                overlay.classList.add('active');
                letter.classList.add('active');
                document.body.style.overflow = 'hidden'; 
                isAnimating = false; 
            }, ENVELOPE_OPEN_DURATION - 100); 
        }

        // Event listener dipasang pada .envelope-wrapper, tetapi memverifikasi bahwa klik berasal dari .envelope-body
        envelopes.forEach(env => {
            env.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Memastikan klik berasal dari area judul/ikon, bukan dari area amplop yang lain
                const targetBody = e.target.closest('.envelope-body');
                if (targetBody) {
                    openLetter(this);
                }
            });
        });

        // Event listener untuk tombol tutup surat di modal
        modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeLetter();
            });
        });

        // Event listener untuk overlay (klik di luar modal)
        overlay.addEventListener('click', closeLetter);

        // Event listener untuk tombol tutup di Closing Section
        closingCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closingSection.classList.remove('active');

            // RESET STATUS SEMUA AMPLOP
            envelopes.forEach(env => {
                env.classList.remove('read');
                env.classList.remove('opening');
                env.classList.remove('closing');
            });
            activeEnvelope = null;
        });