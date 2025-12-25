document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  const API_BASE = "https://gift-card-backend-ecbd.onrender.com/api";
});

const editBtn = document.getElementById("editBalanceBtn");
editBtn.addEventListener("click", async () => {
  const cardNumber = cardInput.value.trim();
  const balance = balanceInput.value || defaultSelect.value;

  if (!cardNumber || !balance) {
    alert("Fill all fields");
    return;
  }
  const API_BASE = window.location.origin;
  const res = await fetch(
    `${API_BASE}/admin/edit-balance/${cardNumber}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ balance })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Error updating card");
    return;
  }

  alert("Balance updated successfully");
  loadCards();
});
