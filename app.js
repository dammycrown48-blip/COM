document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
       1. Sticky Header & Active Navigation Link Styling via Scroll
       ========================================================================== */
  const header = document.getElementById("header");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-menu .nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-nav .mobile-link");

  const handleScroll = () => {
    // Sticky Header scroll styling toggle
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Active State of sections highlighting
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120; // accounting for sticky header offset
      const sectionHeight = section.offsetHeight;
      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSectionId = section.getAttribute("id");
      }
    });

    if (currentSectionId) {
      updateActiveLinks(currentSectionId);
    }
  };

  const updateActiveLinks = (id) => {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${id}`) {
        link.classList.add("active");
      }
    });
    mobileLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${id}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Trigger immediately to format layout on load

  /* ==========================================================================
       2. Mobile Navigation Hamburger Menu & Drawer Slide-out
       ========================================================================== */
  const hamburger = document.getElementById("hamburger-menu");
  const mobileDrawer = document.getElementById("mobile-drawer");

  const toggleMenu = () => {
    const isOpen = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", !isOpen);
    hamburger.classList.toggle("active");
    mobileDrawer.classList.toggle("open");

    // Prevent body scrolling when drawer is open
    document.body.style.overflow = !isOpen ? "hidden" : "";
  };

  hamburger.addEventListener("click", toggleMenu);

  // Close drawer when links are clicked
  const closeDrawerAndScroll = () => {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.classList.remove("active");
    mobileDrawer.classList.remove("open");
    document.body.style.overflow = "";
  };

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeDrawerAndScroll);
  });

  // Close mobile drawer if header CTA is clicked inside drawer
  const mobileCta = mobileDrawer.querySelector(".mobile-cta-btn");
  if (mobileCta) {
    mobileCta.addEventListener("click", closeDrawerAndScroll);
  }

  // Close drawer when close button is clicked
  const closeDrawerBtn = document.getElementById("close-drawer");
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener("click", closeDrawerAndScroll);
  }

  /* ==========================================================================
       3. 4-Slide Animated Hero Slider Carousel with Infinite Loop & Touch Gestures
       ========================================================================== */
  const slides = document.querySelectorAll("#hero-slider .slide");
  const prevBtn = document.getElementById("slide-prev");
  const nextBtn = document.getElementById("slide-next");
  const indicatorDots = document.querySelectorAll("#slider-indicators .dot");

  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideInterval;
  const slideDuration = 6000; // 6 seconds auto-slide

  const updateSliderUI = (index) => {
    // Remove active from previous slide & indicators
    slides.forEach((slide) => slide.classList.remove("active"));
    indicatorDots.forEach((dot) => dot.classList.remove("active"));

    // Assign active to current index
    slides[index].classList.add("active");
    indicatorDots[index].classList.add("active");
  };

  const nextSlideFunc = () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSliderUI(currentSlide);
  };

  const prevSlideFunc = () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSliderUI(currentSlide);
  };

  const startAutoSlide = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlideFunc, slideDuration);
  };

  const resetSlideTimer = () => {
    startAutoSlide(); // restarts the timer on manual inputs
  };

  // Navigation Arrow Action Listeners
  nextBtn.addEventListener("click", () => {
    nextSlideFunc();
    resetSlideTimer();
  });

  prevBtn.addEventListener("click", () => {
    prevSlideFunc();
    resetSlideTimer();
  });

  // Dot Indicators Click Listeners
  indicatorDots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const destIndex = parseInt(e.target.getAttribute("data-slide"));
      currentSlide = destIndex;
      updateSliderUI(currentSlide);
      resetSlideTimer();
    });
  });

  // Mobile Slider Swipe Gesture Detection Utilities
  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 50; // minimum pixels to count as swipe

  const heroSliderContainer = document.getElementById("hero-slider");

  heroSliderContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  heroSliderContainer.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    },
    { passive: true },
  );

  const handleSwipeGesture = () => {
    const swipedDistance = touchEndX - touchStartX;
    if (Math.abs(swipedDistance) > minSwipeDistance) {
      if (swipedDistance < 0) {
        // Swipe Left: Next Slide
        nextSlideFunc();
      } else {
        // Swipe Right: Prev Slide
        prevSlideFunc();
      }
      resetSlideTimer();
    }
  };

  // Initialize Auto-Slide rotation
  startAutoSlide();

  /* ==========================================================================
       4. Projects Portfolio Gallery Grid Category Filtering
       ========================================================================== */
  const filterButtons = document.querySelectorAll(
    ".project-filters .filter-btn",
  );
  const projectItems = document.querySelectorAll(
    ".project-gallery .project-item",
  );

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Remove active style from other buttons
      filterButtons.forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");

      const filterValue = e.target.getAttribute("data-filter");

      projectItems.forEach((item) => {
        const category = item.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          item.classList.remove("hide");
          // Add micro fade animation
          item.style.opacity = "0";
          setTimeout(() => {
            item.style.opacity = "1";
          }, 50);
        } else {
          item.classList.add("hide");
        }
      });
    });
  });

  /* ==========================================================================
       5. Request a Quote - Overlay Modal & Form Validations
       ========================================================================== */
  const openQuoteButtons = document.querySelectorAll(".open-quote-modal");
  const quoteModal = document.getElementById("quote-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const cancelModalBtn = document.getElementById("cancel-modal");
  const quoteForm = document.getElementById("quote-form");

  // Toast element selectors
  const successToast = document.getElementById("success-toast");
  const closeToastBtn = document.getElementById("close-toast");

  const openModal = () => {
    quoteModal.classList.add("open");
    document.body.style.overflow = "hidden"; // stop main page scrolls
  };

  const closeModal = () => {
    quoteModal.classList.remove("open");
    document.body.style.overflow = "";
    resetFormErrors();
  };

  openQuoteButtons.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  closeModalBtn.addEventListener("click", closeModal);
  cancelModalBtn.addEventListener("click", closeModal);

  // Close when overlay background is clicked (excluding critical modal elements)
  quoteModal.addEventListener("click", (e) => {
    if (e.target === quoteModal) {
      closeModal();
    }
  });

  // Form inputs and inline validation error setups
  const inputName = document.getElementById("quote-name");
  const inputEmail = document.getElementById("quote-email");
  const selectType = document.getElementById("quote-project-type");
  const textMessage = document.getElementById("quote-message");
  const checkboxConsent = document.getElementById("quote-consent");

  const setErrorClass = (element, isInvalid) => {
    const formGroup = element.closest(".form-group");
    if (isInvalid) {
      formGroup.classList.add("invalid");
    } else {
      formGroup.classList.remove("invalid");
    }
  };

  const resetFormErrors = () => {
    document.querySelectorAll(".form-group").forEach((group) => {
      group.classList.remove("invalid");
    });
    quoteForm.reset();
  };

  const validateForm = () => {
    let isValid = true;

    // Name Validation
    if (inputName.value.trim() === "") {
      setErrorClass(inputName, true);
      isValid = false;
    } else {
      setErrorClass(inputName, false);
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputEmail.value.trim())) {
      setErrorClass(inputEmail, true);
      isValid = false;
    } else {
      setErrorClass(inputEmail, false);
    }

    // Project Type Select Select validation
    if (selectType.value === "") {
      setErrorClass(selectType, true);
      isValid = false;
    } else {
      setErrorClass(selectType, false);
    }

    // Message field length assessment
    if (textMessage.value.trim() === "") {
      setErrorClass(textMessage, true);
      isValid = false;
    } else {
      setErrorClass(textMessage, false);
    }

    // Checkbox consent authorization
    if (!checkboxConsent.checked) {
      // Checkboxes can look fine visually but custom color borders on label might show
      checkboxConsent.style.outline = "2px solid #DC2626";
      isValid = false;
    } else {
      checkboxConsent.style.outline = "none";
    }

    return isValid;
  };

  // Form Submission Actions
  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Close form modal
      closeModal();

      // Open Success Modal Overlay Toast
      successToast.classList.add("open");
      document.body.style.overflow = "hidden";

      // Log submission context (simulated network request payload)
      console.log("Skatenne Quote Request successfully submitted:", {
        name: inputName.value,
        email: inputEmail.value,
        phone: document.getElementById("quote-phone").value,
        projectType: selectType.value,
        details: textMessage.value,
      });

      // Reset form details
      resetFormErrors();
    }
  });

  // Close toast listeners
  const closeToast = () => {
    successToast.classList.remove("open");
    document.body.style.overflow = "";
  };

  closeToastBtn.addEventListener("click", closeToast);
  successToast.addEventListener("click", (e) => {
    if (e.target === successToast) {
      closeToast();
    }
  });

  /* ==========================================================================
       6. Scroll Trigger Animations via Intersection Observer
       ========================================================================== */
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if ("IntersectionObserver" in window) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");
            // Stop observing once appeared
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15, // trigger when 15% seen
        rootMargin: "0px 0px -50px 0px", // offset bottom triggers slightly
      },
    );

    animatedElements.forEach((el) => scrollObserver.observe(el));
  } else {
    // Fallback for browsers lacking observer support: show everything immediately
    animatedElements.forEach((el) => el.classList.add("appear"));
  }

  /* ==========================================================================
       7. WhatsApp Chatbot Widget Interactions & Redirections
       ========================================================================== */
  const whatsappWidget = document.getElementById("whatsapp-bot-widget");
  const whatsappBtn = document.getElementById("whatsapp-btn");
  const whatsappChatBox = document.getElementById("whatsapp-chat-box");
  const closeWhatsapp = document.getElementById("close-whatsapp");
  const whatsappForm = document.getElementById("whatsapp-chat-form");
  const whatsappInput = document.getElementById("whatsapp-chat-input");
  const chatFlowZone = document.getElementById("whatsapp-chat-body");
  const quickRepliesSection = document.getElementById("whatsapp-quick-replies");

  const whatsappPhone = "2348034179960"; // Phone number: 08034179960 (Nigerian international format)

  // Toggle chatbox visibility
  const toggleWhatsappChat = () => {
    whatsappChatBox.classList.toggle("open");
    // Clear notifications badge when chatbot opens
    const badge = whatsappBtn.querySelector(".whatsapp-badge-pulse");
    if (badge) badge.remove();
  };

  whatsappBtn.addEventListener("click", toggleWhatsappChat);
  closeWhatsapp.addEventListener("click", () => {
    whatsappChatBox.classList.remove("open");
  });

  // Appends message to chat bubble flow zone
  const appendChatMessage = (text, sender) => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(sender === "bot" ? "bot-msg" : "user-msg");
    const p = document.createElement("p");
    p.textContent = text;
    msgDiv.appendChild(p);
    
    // Insert before quick replies if they exist, or append at bottom
    if (sender === "user" && quickRepliesSection) {
      chatFlowZone.insertBefore(msgDiv, quickRepliesSection);
    } else {
      chatFlowZone.appendChild(msgDiv);
    }
    
    // Auto scroll to bottom
    chatFlowZone.scrollTop = chatFlowZone.scrollHeight;
  };

  // Redirect client to WhatsApp API URL
  const redirectToWhatsApp = (messageText) => {
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedText}`;
    
    // Briefly delay redirect to let user bubble render in chat UI
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 800);
  };

  // Handle Quick Replies Clicks
  const quickReplyButtons = document.querySelectorAll(".quick-reply-btn");
  quickReplyButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const selectedOption = e.target.textContent;
      const keyOption = e.target.getAttribute("data-reply");
      
      // Hide quick reply area after click to simulate choice progress
      if (quickRepliesSection) {
        quickRepliesSection.style.display = "none";
      }

      // Render user selected option in bubbles
      appendChatMessage(selectedOption, "user");

      // Custom message formats based on category selection
      let sendMsgText = "";
      if (keyOption === "Request Quote") {
        sendMsgText = "Hello Skatenne, I would like to request a quote for a construction project. Please let know what details you require.";
      } else if (keyOption === "General Inquiry") {
        sendMsgText = "Hello Skatenne, I have a general inquiry about your services.";
      } else if (keyOption === "HSE Safety Standards") {
        sendMsgText = "Hello Skatenne, I'd like to read about or discuss your health, safety, and environmental (HSE) standards.";
      } else {
        sendMsgText = `Hello Skatenne, I have an inquiry regarding: ${selectedOption}`;
      }

      // Append bot transition response and redirect
      setTimeout(() => {
        appendChatMessage("Excellent choice. Transferring you to our engineering desk on WhatsApp...", "bot");
        redirectToWhatsApp(sendMsgText);
      }, 1000);
    });
  });

  // Handle custom text field inputs submit
  whatsappForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userText = whatsappInput.value.trim();
    if (userText === "") return;

    // Clear quick replies since user chose typing
    if (quickRepliesSection) {
      quickRepliesSection.style.display = "none";
    }

    // Append custom text bubble to body
    appendChatMessage(userText, "user");
    whatsappInput.value = ""; // clear field

    // Append response and redirect
    setTimeout(() => {
      appendChatMessage("Opening WhatsApp to transmit your message directly...", "bot");
      redirectToWhatsApp(userText);
    }, 1000);
  });
});
