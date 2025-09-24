document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.sidebar-nav ul li a');
    const bottomNavLinks = document.querySelectorAll('.sidebar-bottom ul li a');
    const allNavLinks = [...navLinks, ...bottomNavLinks];
    const pages = document.querySelectorAll('.page');

    // Function to handle navigation
    function handleNavigation(link) {
        // Remove active class from all sidebar items
        document.querySelectorAll('.sidebar-nav ul li').forEach(li => li.classList.remove('active'));
        document.querySelectorAll('.sidebar-bottom ul li').forEach(li => li.classList.remove('active'));
        
        // Add active class to clicked item
        link.parentElement.classList.add('active');

        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));

        // Get the text content and map it to the correct page ID
        const linkText = link.querySelector('span').innerText.toLowerCase();
        let targetId = '';
        
        // Map sidebar text to page IDs
        switch(linkText) {
            case 'dashboard':
                targetId = 'dashboard';
                break;
            case 'front desk':
                targetId = 'frontdesk';
                break;
            case 'guest':
                targetId = 'guest';
                break;
            case 'rooms':
                targetId = 'rooms';
                break;
            case 'messenger':
                targetId = 'messenger';
                break;
            case 'settings':
                targetId = 'settings';
                break;
            case 'logout':
                // Handle logout functionality
                alert('Logout functionality would be implemented here');
                return;
            default:
                targetId = 'dashboard'; // Default to dashboard
        }

        // Show the target page
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    // Add event listeners to all navigation links
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigation(link);
        });
    });

    // Initialize with dashboard active
    const dashboardLink = document.querySelector('.sidebar-nav ul li.active a');
    if (dashboardLink) {
        handleNavigation(dashboardLink);
    }
});
// Toggle dropdown on user profile click
const profileArrow = document.getElementById('dropdown-icon');
const dropdownMenu = document.getElementById('dropdown-menu');

if (profileArrow && dropdownMenu) {
    profileArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
    });
}

// Booking Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const bookingModal = document.getElementById('bookingModal');
    const createBookingBtn = document.querySelector('.create-booking-btn');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancelBooking');
    const bookingForm = document.getElementById('bookingForm');

    // Open modal when Create Booking button is clicked
    if (createBookingBtn) {
        createBookingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bookingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    // Close modal functions
    function closeModal() {
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
        bookingForm.reset(); // Reset form when closing
    }

    // Close modal when X button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when Cancel button is clicked
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside the modal content
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal.style.display === 'flex') {
            closeModal();
        }
    });

    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(bookingForm);
            const bookingData = {};
            
            for (let [key, value] of formData.entries()) {
                bookingData[key] = value;
            }

            // Validate dates
            const checkIn = new Date(bookingData.checkIn);
            const checkOut = new Date(bookingData.checkOut);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (checkIn < today) {
                alert('Check-in date cannot be in the past');
                return;
            }

            if (checkOut <= checkIn) {
                alert('Check-out date must be after check-in date');
                return;
            }

            // Simulate booking creation
            console.log('Booking Data:', bookingData);
            
            // Show success message
            alert('Booking created successfully!');
            
            // Close modal
            closeModal();
            
            // Here you would typically send the data to your server
            // fetch('/api/bookings', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(bookingData)
            // });
        });
    }

    // Set minimum date for check-in to today
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput) {
        const today = new Date().toISOString().split('T')[0];
        checkInInput.setAttribute('min', today);
        
        // Update check-out minimum when check-in changes
        checkInInput.addEventListener('change', () => {
            const checkInDate = checkInInput.value;
            if (checkInDate) {
                const nextDay = new Date(checkInDate);
                nextDay.setDate(nextDay.getDate() + 1);
                checkOutInput.setAttribute('min', nextDay.toISOString().split('T')[0]);
            }
        });
    }
});

// Check-in Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkinModal = document.getElementById('checkinModal');
    const newCheckinBtn = document.querySelector('.section-header .btn-primary');
    const closeCheckinBtn = document.getElementById('closeCheckin');
    const cancelCheckinBtn = document.getElementById('cancelCheckin');
    const checkinForm = document.getElementById('checkinForm');

    // Open check-in modal when "New Check-in" button is clicked
    if (newCheckinBtn && newCheckinBtn.textContent.includes('New Check-in')) {
        newCheckinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            checkinModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Set default values
            const today = new Date().toISOString().split('T')[0];
            const now = new Date().toTimeString().slice(0, 5);
            document.getElementById('checkinDate').value = today;
            document.getElementById('checkinTime').value = now;
        });
    }

    // Close check-in modal functions
    function closeCheckinModal() {
        checkinModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        checkinForm.reset();
    }

    // Close modal when X button is clicked
    if (closeCheckinBtn) {
        closeCheckinBtn.addEventListener('click', closeCheckinModal);
    }

    // Close modal when Cancel button is clicked
    if (cancelCheckinBtn) {
        cancelCheckinBtn.addEventListener('click', closeCheckinModal);
    }

    // Close modal when clicking outside the modal content
    checkinModal.addEventListener('click', (e) => {
        if (e.target === checkinModal) {
            closeCheckinModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && checkinModal.style.display === 'flex') {
            closeCheckinModal();
        }
    });

    // Check-in form submission
    if (checkinForm) {
        checkinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(checkinForm);
            const checkinData = {};
            
            for (let [key, value] of formData.entries()) {
                checkinData[key] = value;
            }

            // Validate check-in date
            const checkinDate = new Date(checkinData.checkinDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (checkinDate < today) {
                alert('Check-in date cannot be in the past');
                return;
            }

            // Calculate check-out date based on duration
            const duration = parseInt(checkinData.duration);
            const checkoutDate = new Date(checkinDate);
            checkoutDate.setDate(checkoutDate.getDate() + duration);
            checkinData.checkoutDate = checkoutDate.toISOString().split('T')[0];

            // Simulate check-in processing
            console.log('Check-in Data:', checkinData);
            
            // Show success message
            alert(`Check-in successful!\nGuest: ${checkinData.guestName}\nRoom: ${checkinData.roomNumber}\nCheck-out: ${checkinData.checkoutDate}`);
            
            // Close modal
            closeCheckinModal();
            
            // Here you would typically send the data to your server
            // fetch('/api/checkins', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(checkinData)
            // });
        });
    }

    // Set minimum date for check-in to today
    const checkinDateInput = document.getElementById('checkinDate');
    
    if (checkinDateInput) {
        const today = new Date().toISOString().split('T')[0];
        checkinDateInput.setAttribute('min', today);
    }
});
  