
document.querySelectorAll('[data-buttons="true"]').forEach(
    function (e) {
        [].slice.call(e.querySelectorAll("label.btn")).map((function (label) {

            label.querySelector("input").addEventListener('change', function () {


                if((this.type === "checkbox" || this.type === "radio") && this.checked == false)
                {
                    return;
                }

                if(this.type === "checkbox")
                {
                    [].slice.call(e.querySelectorAll(".active")).map((function(act)
                    {
                        act.classList.remove("active");
                    }));
                }

                if(this.type === "radio")
                {
                    document.querySelectorAll("[name=\"" + this.name + "\"]").forEach((function(unact)
                    {
                        unact.closest("label.btn").classList.remove("active");
                    }));
                }

                label.classList.add("active");
            });
        }));
    }
);