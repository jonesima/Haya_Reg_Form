
        document.addEventListener('DOMContentLoaded', function() {
            // Set current year in footer
            document.getElementById('currentYear').textContent = new Date().getFullYear();
            
            // Form elements
            const form = document.getElementById('memberForm');
            const registrationForm = document.getElementById('registrationForm');
            const successMessage = document.getElementById('successMessage');
            const loadingOverlay = document.getElementById('loadingOverlay');
            const newRegistrationBtn = document.getElementById('newRegistrationBtn');
            const previewBtn = document.getElementById('previewBtn');
            const downloadCertificateBtn = document.getElementById('downloadCertificateBtn');
            const certificateDetails = document.getElementById('certificateDetails');
            
            // Error elements
            const errorElements = {
                fullName: document.getElementById('fullNameError'),
                dob: document.getElementById('dobError'),
                gender: document.getElementById('genderError'),
                occupation: document.getElementById('occupationError'),
                email: document.getElementById('emailError'),
                phone: document.getElementById('phoneError'),
                address: document.getElementById('addressError'),
                terms: document.getElementById('termsError')
            };
            
            // Preview certificate button click
            previewBtn.addEventListener('click', function() {
                const fullName = document.getElementById('fullName').value;
                const dob = document.getElementById('dob').value;
                
                if (fullName) {
                    document.getElementById('previewName').textContent = fullName;
                    
                    const today = new Date();
                    const formattedDate = today.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    });
                    document.getElementById('previewDate').textContent = formattedDate;
                    
                    certificateDetails.classList.remove('hidden');
                } else {
                    alert('Please enter your full name to preview the certificate');
                }
            });
            
            // Form submission
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Reset errors
                Object.values(errorElements).forEach(el => el.classList.add('hidden'));
                
                // Validate form
                let isValid = true;
                
                // Required fields
                const requiredFields = ['fullName', 'dob', 'gender', 'occupation', 'email', 'phone', 'address', 'terms'];
                
                requiredFields.forEach(field => {
                    let fieldElement;
                    let fieldValue;
                    
                    if (field === 'gender') {
                        fieldElement = document.querySelector('input[name="gender"]:checked');
                        fieldValue = fieldElement ? fieldElement.value : '';
                    } else if (field === 'terms') {
                        fieldElement = document.getElementById('terms');
                        fieldValue = fieldElement.checked;
                    } else {
                        fieldElement = document.getElementById(field);
                        fieldValue = fieldElement.value.trim();
                    }
                    
                    if (!fieldValue) {
                        errorElements[field].classList.remove('hidden');
                        if (fieldElement && field !== 'gender' && field !== 'terms') {
                            fieldElement.classList.add('input-error');
                        }
                        isValid = false;
                    } else {
                        if (fieldElement && field !== 'gender' && field !== 'terms') {
                            fieldElement.classList.remove('input-error');
                        }
                    }
                });
                
                // Additional validation for email
                const email = document.getElementById('email').value.trim();
                if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    errorElements.email.classList.remove('hidden');
                    document.getElementById('email').classList.add('input-error');
                    isValid = false;
                }
                
                if (!isValid) {
                    return;
                }
                
                // Show loading overlay
                loadingOverlay.classList.remove('hidden');
                
                // Simulate form submission (in a real app, this would be an API call)
                setTimeout(function() {
                    loadingOverlay.classList.add('hidden');
                    registrationForm.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                    
                    // Scroll to top of success message
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                }, 3000);
            });
            
            // New registration button click
            newRegistrationBtn.addEventListener('click', function() {
                successMessage.classList.add('hidden');
                registrationForm.classList.remove('hidden');
                form.reset();
                certificateDetails.classList.add('hidden');
                
                // Scroll to top of form
                registrationForm.scrollIntoView({ behavior: 'smooth' });
            });
            
            // Download certificate button click
            downloadCertificateBtn.addEventListener('click', function() {
                alert('In a real application, this would download the membership certificate PDF');
            });
        });