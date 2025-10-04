const envelopes = document.querySelectorAll('.envelope-wrapper');
    const envelopes = document.querySelectorAll('.envelope-wrapper');
    const overlay = document.querySelector('.overlay');
    const letters = document.querySelectorAll('.letter-modal');
    const closingSection = document.querySelector('.closing-section');
    
    const modalCloseBtns = document.querySelectorAll('.letter-modal .close-btn');
    const closingCloseBtn = document.querySelector('.closing-close-btn');

    // Durasi Transisi (diambil dari CSS)
    const ENVELOPE_OPEN_DURATION = 500; 
    const PAPER_TRANSITION_DURATION = 400; 
    
    let activeEnvelope = null;
    let isAnimating = false; 

    /**
     * Memeriksa apakah semua amplop memiliki class 'read'.
     * @returns {boolean} True jika semua sudah dibaca.
     */
    function checkAllRead(){
        return Array.from(envelopes).every(env => env.classList.contains('read'));
    }

    /**
     * Menutup modal surat yang sedang aktif dan memulai animasi penutup amplop.
     */
    function closeLetter(){
        if (isAnimating) return; // Mencegah klik ganda
        isAnimating = true; 
        
        // Bebaskan scrolling pada body
        document.body.style.overflow = '';
        letters.forEach(l => l.classList.remove('active'));
        overlay.classList.remove('active');
        
        const currentEnvelope = activeEnvelope;
        activeEnvelope = null; 

        if (currentEnvelope) {
            currentEnvelope.classList.add('closing');
            
            // Tunggu animasi kertas masuk (PAPER_TRANSITION_DURATION)
            setTimeout(() => {
                currentEnvelope.classList.remove('opening');
                
                // Tunggu animasi tutup flap amplop (ENVELOPE_OPEN_DURATION)
                setTimeout(() => {
                    currentEnvelope.classList.remove('closing');
                    
                    isAnimating = false;
                    
                    // Setelah amplop tertutup, cek apakah semua sudah dibaca
                    if (checkAllRead()) {
                        closingSection.classList.add('active');
                        // Kunci scroll body saat closing section aktif
                        document.body.style.overflow = 'hidden'; 
                    }
                }, ENVELOPE_OPEN_DURATION); 

            }, PAPER_TRANSITION_DURATION);
        } else {
            isAnimating = false;
        }
    }

    /**
     * Membuka amplop dan menampilkan modal surat.
     * @param {HTMLElement} envelopeElement - Elemen amplop yang diklik.
     */
    function openLetter(envelopeElement) {
        if (closingSection.classList.contains('active') || isAnimating) return; 

        isAnimating = true;

        activeEnvelope = envelopeElement; 
        
        const letterType = envelopeElement.getAttribute('data-letter');
        const letter = document.getElementById('letter-' + letterType);

        envelopeElement.classList.remove('closing');
        envelopeElement.classList.add('opening');
        
        // Tandai amplop sebagai 'read' (untuk indikator hijau)
        if (!envelopeElement.classList.contains('read')) {
            envelopeElement.classList.add('read');
        }
        
        // Tampilkan modal setelah flap terbuka
        setTimeout(() => {
            overlay.classList.add('active');
            letter.classList.add('active');
            document.body.style.overflow = 'hidden'; // Kunci scroll body saat modal aktif
            isAnimating = false; 
        }, ENVELOPE_OPEN_DURATION - 100); // Sedikit lebih cepat dari durasi animasi flap
    }

    // Event listener untuk membuka surat (klik amplop)
    envelopes.forEach(env => {
        env.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Memastikan klik berasal dari area judul/ikon (.envelope-body)
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

        // Bebaskan scroll body saat penutup ditutup
        document.body.style.overflow = ''; 

        // RESET STATUS DAN AMPLOP (opsional: agar bisa dibaca ulang)
        envelopes.forEach(env => {
            env.classList.remove('read');
            env.classList.remove('opening');
            env.classList.remove('closing');
        });
        activeEnvelope = null;
    });


