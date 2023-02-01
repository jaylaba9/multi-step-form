"use strict";

const btnBack = document.querySelectorAll(".btn-back");
const btnNext = document.querySelector(".btn-next");
const btnNextDesktop = document.querySelector(".btn-next-desktop");
const btnsSteps = Array.from(document.querySelectorAll(".btn-steps"));
const btnPlan = document.querySelectorAll(".plan");
const pagesArr = Array.from(document.querySelector(".form-wrapper").children);
const bottomNav = document.querySelector(".bottom-nav");
const bottomNavDesktop = document.querySelector(".bottom-nav-desktop");
const timeCheckbox = document.querySelector(".toggle-checkbox");
const planDetailsMo = document.querySelectorAll(".plan__details.monthly");
const planDetailsYr = document.querySelectorAll(".plan__details.yearly");
const monthlySwitch = document.querySelector(".monthlySwitch");
const yearlySwitch = document.querySelector(".yearlySwitch");
const addOns = Array.from(document.querySelectorAll(".add-on label input"));
const addOnsPrice = document.querySelectorAll(".add-on__price");
const selectedPlan = document.querySelector(".selected-plan");
const elSelectedAddOns = document.querySelector(".selected-add-ons");
const elTotalPrice = document.querySelector(".total");

let currentPage = 1;
timeCheckbox.checked = false;
let selectedAddOns = [];

const handleNextPage = function (e) {
  e.preventDefault();

  // Check if user selected plan when trying to leave page 2
  if (currentPage === 2 && Object.keys(planData).length === 0) {
    alert("You should choose one of the available plans!");
    return;
  }

  // hide currently active page
  pagesArr
    .find((page) => page.dataset.page == currentPage)
    .classList.add("display-none");
  // remove higlight from the sidebar for this page
  btnsSteps
    .find((btn) => btn.dataset.page == currentPage)
    .classList.remove("active");
  // next page
  currentPage++;

  // add 'Go Back' button when page is > 1
  if (currentPage > 1) btnBack.forEach((btn) => btn.classList.remove("hidden"));

  // if we're leaving page 3 -> run a function to find out what addons have been chosen
  if (currentPage === 4) {
    selectedAddOns = getSelectedAddOns();
    // and also display a summary
    createSummary(selectedAddOns);
  }

  // show next page
  pagesArr
    .find((page) => page.dataset.page == currentPage)
    .classList.remove("display-none");
  // highlight currently active page on the sidebar
  if (currentPage < 5) {
    btnsSteps
      .find((btn) => btn.dataset.page == currentPage)
      .classList.add("active");
    // hide bottom navigation when user reaches thank-you page
  } else {
    bottomNav.classList.add("display-none");
    bottomNavDesktop.classList.add("display-none");
  }
};

const handlePrevPage = function () {
  // hide currently active page
  pagesArr
    .find((page) => page.dataset.page == currentPage)
    .classList.add("display-none");
  // remove higlight from the sidebar for this page
  btnsSteps
    .find((btn) => btn.dataset.page == currentPage)
    .classList.remove("active");
  // next page
  currentPage--;

  // remove 'Go Back' button when page is === 1
  if (currentPage === 1) btnBack.forEach((btn) => btn.classList.add("hidden"));

  // show next page
  pagesArr
    .find((page) => page.dataset.page == currentPage)
    .classList.remove("display-none");
  // highlight currently active page on the sidebar
  btnsSteps
    .find((btn) => btn.dataset.page == currentPage)
    .classList.add("active");
};

const handleTimeChange = function () {
  if (this.checked) {
    planDetailsMo.forEach((plan) => plan.classList.add("display-none"));
    planDetailsYr.forEach((plan) => plan.classList.remove("display-none"));
    yearlySwitch.classList.add("highlight");
    monthlySwitch.classList.remove("highlight");
  } else {
    planDetailsYr.forEach((plan) => plan.classList.add("display-none"));
    planDetailsMo.forEach((plan) => plan.classList.remove("display-none"));
    yearlySwitch.classList.remove("highlight");
    monthlySwitch.classList.add("highlight");
  }
};

let planData = {};
const getPlanData = function () {
  const clicked = Array.from(this.children);

  // if selected subscription is set to yearly
  if (timeCheckbox.checked) {
    const clickedData = clicked.find((el) => el.classList.contains("yearly"));

    planData = {
      plan: clickedData.dataset.plan,
      subscription: clickedData.dataset.subscription,
      price: Number(clickedData.dataset.price),
    };
    // update addons prices
    addOnsPrice[0].innerHTML = "+$10/yr";
    addOnsPrice[1].innerHTML = "+$20/yr";
    addOnsPrice[2].innerHTML = "+$20/yr";

    // if selected subscription is set to monthly
  } else {
    const clickedData = clicked.find((el) => el.classList.contains("monthly"));

    planData = {
      plan: clickedData.dataset.plan,
      subscription: clickedData.dataset.subscription,
      price: Number(clickedData.dataset.price),
    };
  }
};

const getSelectedAddOns = function () {
  let selectedAddOns = [];
  addOns.forEach((addon) => {
    if (addon.checked) {
      selectedAddOns.push({
        name: addon.title,
        price:
          planData.subscription === "month"
            ? Number(addon.value)
            : Number(addon.value * 10),
      });
    }
  });
  return selectedAddOns;
};

const createSummary = function (addons) {
  // PLAN
  selectedPlan.innerHTML = `
			<div class="selected-plan__details">
				<span class="highlight">${planData.plan} (${
    planData.subscription === "month" ? "Monthly" : "Yearly"
  })</span>
				
			</div>
			<p class="highlight">$${planData.price}/${
    planData.subscription === "month" ? "mo" : "yr"
  }</p>
  `;

  // ADDONS
  let addonsPrice = 0;
  elSelectedAddOns.innerHTML = ``;
  for (const addon of addons) {
    addonsPrice += addon.price;

    elSelectedAddOns.innerHTML += `
    	<div class="selected-add-on">
    		<p class="selected-add-on__name">${addon.name}</p>
    		<p class="selected-add-on__price">+$${addon.price}/${
      planData.subscription === "month" ? "mo" : "yr"
    }</p>
    	</div>
    `;
  }

  // TOTAL PRICE
  const total = planData.price + addonsPrice;
  elTotalPrice.innerHTML = `
		<p>Total (per ${planData.subscription === "month" ? "month" : "year"})</p>
		<p class="total-price">+$${total}/${
    planData.subscription === "month" ? "mo" : "yr"
  }</p>
	`;
};

btnNext.addEventListener("click", handleNextPage);
btnNextDesktop.addEventListener("click", handleNextPage);
btnBack.forEach((btn) => btn.addEventListener("click", handlePrevPage));
btnPlan.forEach((btn) => btn.addEventListener("click", getPlanData));
timeCheckbox.addEventListener("change", handleTimeChange);
