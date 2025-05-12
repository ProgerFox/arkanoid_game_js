export const AboutWindow = {
  about_popup: document.getElementById("about_window"),
  about_close_btn: document.getElementById("about_close_btn"),
  ShowWindow: false,

  ToggleVisibility() {
    this.ShowWindow = !this.ShowWindow;
    this.about_popup.style.display = this.ShowWindow ? "flex": "none";
  },

  init() {
    this.about_popup.style.display = "none";

    this.about_close_btn.addEventListener("click", () => {
      this.ToggleVisibility();
    });
  },
}