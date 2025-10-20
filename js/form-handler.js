// Form handling functionality
// Enhanced version with Web3Forms integration and better error handling

function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) {
    console.warn("Contact form element not found");
    return;
  }

  // Ensure required hidden fields exist
  ensureWeb3FormsFields(contactForm);

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all fields before submission
    if (!validateAllFields(contactForm)) {
      showNotification(
        "Please fix the errors in the form before submitting.",
        "error"
      );
      return;
    }

    // Get form values
    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const message = document.getElementById("message")?.value.trim();

    // Enhanced validation
    if (!name || !email || !message) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    if (message.length < 10) {
      showNotification(
        "Message should be at least 10 characters long.",
        "error"
      );
      return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading-spinner"></span>Sending...';
    submitBtn.disabled = true;

    // Prepare form data for Web3Forms with all required fields
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);
    formData.append("access_key", getWeb3FormsAccessKey());
    formData.append("subject", `New Contact Form Submission from ${name}`);
    formData.append("from_name", "Portfolio Contact Form");

    // Send to Web3Forms
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          showNotification(
            `Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon!`,
            "success"
          );
          contactForm.reset();
          clearAllFieldErrors(contactForm);
        } else {
          throw new Error(data.message || "Failed to send message");
        }
      })
      .catch((error) => {
        console.error("Form submission error:", error);
        let errorMessage =
          "Sorry, there was an error sending your message. Please try again later.";

        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          errorMessage =
            "Network error: Please check your internet connection and try again.";
        } else if (error.message.includes("HTTP error")) {
          errorMessage = "Server error: Please try again in a few moments.";
        }

        showNotification(errorMessage, "error");
      })
      .finally(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });
}

// Ensure Web3Forms required fields exist
function ensureWeb3FormsFields(form) {
  let accessKeyField = form.querySelector('input[name="access_key"]');
  if (!accessKeyField) {
    accessKeyField = document.createElement("input");
    accessKeyField.type = "hidden";
    accessKeyField.name = "access_key";
    accessKeyField.value = getWeb3FormsAccessKey();
    form.appendChild(accessKeyField);
  }

  // Add subject field if not exists
  let subjectField = form.querySelector('input[name="subject"]');
  if (!subjectField) {
    subjectField = document.createElement("input");
    subjectField.type = "hidden";
    subjectField.name = "subject";
    subjectField.value = "New Contact Form Submission";
    form.appendChild(subjectField);
  }
}
function getWeb3FormsAccessKey() {
  return "de45b2eb-5989-44f2-9885-696cff8aec7c";
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function validateAllFields(form) {
  const fields = form.querySelectorAll(".form-control[required]");
  let isValid = true;

  fields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}
function clearAllFieldErrors(form) {
  const errorFields = form.querySelectorAll(".form-control.error");
  const errorMessages = form.querySelectorAll(".field-error");

  errorFields.forEach((field) => field.classList.remove("error"));
  errorMessages.forEach((error) => error.remove());
}
function showNotification(message, type = "info") {
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => {
    hideNotification(notification);
  });

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.setAttribute("role", "alert");
  notification.setAttribute("aria-live", "polite");
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;

  // Add styles if not already added
  addNotificationStyles();

  document.body.appendChild(notification);

  // Show notification with reduced delay for better UX
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Auto remove after 5 seconds
  const autoRemove = setTimeout(() => {
    hideNotification(notification);
  }, 5000);

  // Close button event
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    clearTimeout(autoRemove);
    hideNotification(notification);
  });

  // Click outside to close
  notification.addEventListener("click", (e) => {
    if (e.target === notification) {
      clearTimeout(autoRemove);
      hideNotification(notification);
    }
  });

  return notification;
}

function hideNotification(notification) {
  if (!notification) return;

  notification.classList.remove("show");
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

function addNotificationStyles() {
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                color: #333;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                max-width: 400px;
                transform: translateX(150%);
                transition: transform 0.3s ease;
                border-left: 4px solid transparent;
            }
            
            .notification-success {
                background: #10b981;
                color: white;
                border-left-color: #059669;
            }
            
            .notification-error {
                background: #ef4444;
                color: white;
                border-left-color: #dc2626;
            }
            
            .notification-info {
                background: #3b82f6;
                color: white;
                border-left-color: #2563eb;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
            }
            
            .notification-message {
                flex: 1;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
    document.head.appendChild(styles);
  }
}

// Enhanced Form Validation
function initFormValidation() {
  const formFields = document.querySelectorAll(".form-control");

  formFields.forEach((field) => {
    field.addEventListener("blur", function () {
      validateField(this);
    });

    field.addEventListener("input", function () {
      clearFieldError(this);
    });

    // Real-time validation for email fields
    if (field.type === "email") {
      field.addEventListener(
        "input",
        debounce(function () {
          if (this.value.trim()) {
            validateField(this);
          }
        }, 500)
      );
    }
  });
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.getAttribute("name") || field.id;

  clearFieldError(field);

  if (field.hasAttribute("required") && !value) {
    showFieldError(field, "This field is required");
    return false;
  }

  if (field.type === "email" && value && !isValidEmail(value)) {
    showFieldError(field, "Please enter a valid email address");
    return false;
  }

  if (fieldName === "message" && value && value.length < 10) {
    showFieldError(field, "Message should be at least 10 characters long");
    return false;
  }

  // Mark field as valid
  field.classList.add("valid");
  return true;
}

function showFieldError(field, message) {
  field.classList.remove("valid");
  field.classList.add("error");

  let errorElement = field.parentNode.querySelector(".field-error");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "field-error";
    field.parentNode.appendChild(errorElement);
  }

  errorElement.textContent = message;
  errorElement.setAttribute("role", "alert");

  addFieldErrorStyles();
}

function clearFieldError(field) {
  field.classList.remove("error");
  const errorElement = field.parentNode.querySelector(".field-error");
  if (errorElement) {
    errorElement.remove();
  }
}

function addFieldErrorStyles() {
  if (!document.querySelector("#field-error-styles")) {
    const styles = document.createElement("style");
    styles.id = "field-error-styles";
    styles.textContent = `
            .form-control {
                width: 100%;
                padding: 12px;
                border: 2px solid #e5e7eb;
                border-radius: 6px;
                transition: all 0.3s ease;
                font-size: 14px;
            }
            
            .form-control:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .form-control.error {
                border-color: #ef4444;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }
            
            .form-control.valid {
                border-color: #10b981;
            }
            
            .field-error {
                color: #ef4444;
                font-size: 0.8rem;
                margin-top: 5px;
                display: block;
                font-weight: 500;
            }
            
            .form-group {
                margin-bottom: 1rem;
            }
        `;
    document.head.appendChild(styles);
  }
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize form handling when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
  initFormValidation();
});

// Export functions for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initContactForm,
    isValidEmail,
    showNotification,
    initFormValidation,
    validateField,
  };
}
