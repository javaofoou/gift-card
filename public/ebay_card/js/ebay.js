document.getElementById("checkBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const cardNumber = document.getElementById("cardNumber").value;
   
fetch("/api/user/check-balance", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    cardNumber,
    cardType: "ebay"
  })
})
.then(res => res.json())
.then(data => {
  console.log(data);

  document.querySelector(".ebay-balance").innerText =
    `$${Number(data.balance).toFixed(2)}`;

  document.querySelector(".ebay-card").style.display = "block";
});
});
