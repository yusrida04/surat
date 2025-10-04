const envelopes = document.querySelectorAll('.envelope-wrapper');
        const overlay = document.querySelector('.overlay');
        const letters = document.querySelectorAll('.letter-modal');
        const closingSection = document.querySelector('.closing-section');
        
        const modalCloseBtns = document.querySelectorAll('.letter-modal .close-btn');
        const closingCloseBtn = document.querySelector('.closing-close-btn');

        let activeEnvelope = null;
        let isAnimating = false;

        function checkAllRead(){
            return Array.from(envelopes).every(env => env.classList.contains('read'));
        }

        function closeLetter(){
            isAnimating = true;
            
            document.body.style.overflow = '';
            letters.forEach(l => l.classList.remove('active'));
            overlay.classList.remove('active');
            
            const currentEnvelope = activeEnvelope;
            activeEnvelope = null;

            setTimeout(() => {
                isAnimating = false;
                
                if (checkAllRead()) {
                    closingSection.classList.add('active');
                }
            }, 400);
        }

        function openLetter(envelopeElement) {
            if (closingSection.classList.contains('active') || isAnimating) return;

            isAnimating = true;

            activeEnvelope = envelopeElement;
            
            const letterType = envelopeElement.getAttribute('data-letter');
            const letter = document.getElementById('letter-' + letterType);
            
            if (!envelopeElement.classList.contains('read')) {
                envelopeElement.classList.add('read');
            }
            
            overlay.classList.add('active');
            letter.classList.add('active');
            document.body.style.overflow = 'hidden';
            isAnimating = false;
        }

        envelopes.forEach(env => {
            env.addEventListener('click', function(e) {
                e.stopPropagation();
                openLetter(this);
            });
        });

        modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeLetter();
            });
        });

        overlay.addEventListener('click', closeLetter);

        closingCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closingSection.classList.remove('active');

            envelopes.forEach(env => {
                env.classList.remove('read');
            });
            activeEnvelope = null;
        });