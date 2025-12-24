document.getElementById("checkBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const cardNumber = document.getElementById("cardNumber").value;
   
fetch("/api/user/check-balance", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    cardNumber,
    cardType: "amazoncard"
  })
})
.then(res => res.json())
.then(data => {
  console.log(data);

  document.querySelector(".balance-amount").innerText =
    `$${Number(data.balance).toFixed(2)}`;

  document.querySelector(".amazon-balance-card").style.display = "block";
});
});
