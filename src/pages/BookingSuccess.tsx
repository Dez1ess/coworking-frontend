import { useEffect } from "react";

function BookingSuccess() {
  useEffect(() => {
    alert("Payment successful");
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "bold",
          color: "green",
        }}
      >
        Payment successful
      </h1>
    </div>
  );
}

export default BookingSuccess;
