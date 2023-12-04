/*
 *  Copyright 2022.  Baks.dev <admin@baks.dev>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

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