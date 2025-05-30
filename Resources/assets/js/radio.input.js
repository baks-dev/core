
document.querySelectorAll('[data-buttons="true"]').forEach(
    function (e) {
        [].slice.call(e.querySelectorAll("label.btn")).map((function (label) {

            label.querySelector("input").addEventListener('change', function () {

                [].slice.call(e.querySelectorAll(".active")).map((function (act) {
                    act.classList.remove("active");
                }));

                if ((this.type === 'checkbox' || this.type === 'radio') && this.checked == false) {
                    return;
                }

                label.classList.add("active");
            });
        }));
    }
);