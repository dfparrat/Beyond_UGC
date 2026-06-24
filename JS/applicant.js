//===NAVBAR TOGGLER FOR MOBILE
    const navbar = document.getElementById('navbarNav');
    const toggler = document.querySelector('.navbar-toggler');
    const bsCollapse = new bootstrap.Collapse(navbar, { toggle: false });

    toggler.addEventListener('click', function() {
        bsCollapse.toggle();
    });

    document.addEventListener('click', function(e) {
        const clickedInsideMenu = e.target.closest('#navbarNav');
        const clickedToggler = e.target.closest('.navbar-toggler');
        
        if (!clickedInsideMenu && !clickedToggler && navbar.classList.contains('show')) {
            bsCollapse.hide();
        }
    });

//===APPLICANT FORM SUBMISSION
 document.addEventListener('DOMContentLoaded', function() {
            const fileInput = document.getElementById('from_resume');
            const uploadArea = document.getElementById('resume-upload-area');
            const selectedFile = document.getElementById('selected-file');
            const fileName = document.getElementById('file-name');
            
            // File upload handling
            uploadArea.addEventListener('click', function() {
                fileInput.click();
            });
            
            uploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.style.borderColor = '#6e5bb3';
                this.style.backgroundColor = '#f5f2ff';
            });
            
            uploadArea.addEventListener('dragleave', function() {
                this.style.borderColor = '#d1d1d1';
                this.style.backgroundColor = '#fafafa';
            });
            
            uploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                this.style.borderColor = '#d1d1d1';
                this.style.backgroundColor = '#fafafa';
                
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    updateFileName();
                }
            });
            
            fileInput.addEventListener('change', updateFileName);
            
            function updateFileName() {
                if (fileInput.files.length) {
                    const file = fileInput.files[0];
                    fileName.textContent = file.name;
                    selectedFile.style.display = 'flex';
                    
                    // Change icon based on file type
                    const icon = selectedFile.querySelector('i');
                    if (file.name.endsWith('.pdf')) {
                        icon.className = 'fas fa-file-pdf';
                    } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                        icon.className = 'fas fa-file-word';
                    } else {
                        icon.className = 'fas fa-file';
                    }
                }
            }
            
            // Form submission
            document.getElementById('applicant-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Simple validation
                let isValid = true;
                const inputs = this.querySelectorAll('input, select, textarea');
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        input.style.borderColor = 'red';
                        isValid = false;
                    } else {
                        input.style.borderColor = '';
                    }
                });
                
                if (isValid) {
                    // Show success message (in a real application, you would submit the form here)
                    alert('Application submitted successfully! We will review your application and get back to you soon.');
                    this.reset();
                    selectedFile.style.display = 'none';
                } else {
                    alert('Please fill in all required fields.');
                }
            });
        });