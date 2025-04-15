document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.querySelector("label[for='files[]']");
    const fileInput = document.getElementById("files[]");
    const response = document.getElementById('response');
    const form = document.getElementById('upload-form');
    const body = document.body;
    const btn = document.getElementById('buttonform');
    const box = document.getElementById('drop-area');
    const fileList = document.getElementById("file-list");

    function toggleLoader() {
        const loader = document.getElementById("loading");
        loader.classList.toggle("hidden");
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        toggleLoader();
        btn.classList.toggle("hidden");
        fileList.classList.toggle("hidden");
        box.classList.remove('items-center');
        box.classList.add('items-end');
        box.classList.toggle("hidden");

        let formData = new FormData(form);
        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append("files[]", fileInput.files[i]);
        }

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "uploadPlanilhas.php", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                const resposta = xhr.responseText;
                const pedidos = JSON.parse(resposta);
                const cativo = Object.values(pedidos[0])[0];
                const litrosTotaisCativo = Object.values(pedidos[0])[1];
                const petronas = Object.values(pedidos[1])[0];
                const litrosTotaisPetronas = Object.values(pedidos[1])[1];
                body.classList.remove('h-screen');
                body.classList.add('h-full');
                response.classList.toggle("hidden");

                listaPedidos(cativo, "Cativo");
                listaPedidos(petronas, "Petronas");

                const litrosSpan = document.createElement("span");
                litrosSpan.classList.add("text-green-600", "font-bold");
                litrosSpan.textContent = `Litros Totais: ${litrosTotaisCativo}`;
                response.appendChild(litrosSpan);

                let handleList = document.getElementById("petronas");
                if (!handleList) {
                    handleList = document.createElement('button');
                    handleList.type = 'button';
                    handleList.id = 'petronas';
                    handleList.textContent = 'Pedidos Petronas';
                    handleList.classList.add('mt-2', 'w-48', 'font-bold', 'cursor-pointer', 'bg-teal-300', 'hover:bg-teal-400', 'transition', 'duration-150', 'rounded-md', 'p-2');
                    response.appendChild(handleList);
                }

                handleList.addEventListener('click', function (e) {
                    const listaPedidosPetronas = document.getElementById('listaPedidosPetronas');
                    const listaPedidosCativo = document.getElementById('listaPedidosCativo');
                    listaPedidosCativo.classList.toggle('hidden');
                    listaPedidosPetronas.classList.toggle('hidden')
                    if (e.target.textContent === 'Pedidos Petronas') {
                        e.target.textContent = 'Pedidos Cativo';
                        litrosSpan.textContent = `Litros Totais: ${litrosTotaisPetronas}`;
                        sendButton.classList.toggle('hidden');
                    } else {
                        e.target.textContent = 'Pedidos Petronas';
                        litrosSpan.textContent = `Litros Totais: ${litrosTotaisCativo}`;
                        sendButton.classList.toggle('hidden');
                    }
                })

                let sendButton = document.getElementById("copy");
                if (!sendButton) {
                    sendButton = document.createElement("button");
                    sendButton.type = "button";
                    sendButton.id = "copy";
                    sendButton.textContent = "Enviar Pedidos";
                    sendButton.classList.add("mt-2", "w-48", "font-bold", "cursor-pointer", "bg-green-300", "hover:bg-green-400", "transition", "duration-150", "rounded-md", "p-2");
                    response.appendChild(sendButton);
                    sendButton.addEventListener("click", function () {

                        if (typeof cativo === 'undefined' || !Array.isArray(cativo) || cativo.length === 0) {
                            alert('Nenhum pedido a enviar!');
                            return;
                        }

                        const sendBanco = new XMLHttpRequest();
                        sendBanco.open("POST", "enviarBanco.php", true);
                        sendBanco.setRequestHeader("Content-Type", "application/json");

                        sendButton.disabled = true;
                        sendButton.textContent = "Enviando...";

                        const data = {
                            cativo: cativo
                        };

                        sendBanco.onreadystatechange = function () {
                            if (sendBanco.readyState === 4 && sendBanco.status === 200) {
                                sendButton.disabled = false;
                                sendButton.textContent = "Enviar Pedidos";
                                try {
                                    const json = JSON.parse(sendBanco.responseText);

                                    if (json.status === 'Success') {
                                        alert('Pedidos Enviados com Sucesso');
                                    } else {
                                        alert('Erro ao enviar o Pedido');
                                    }
                                } catch (e) {
                                    console.log('Erro ao buscar pedidos', e);
                                    console.log("Resposta do servidor:", sendBanco.responseText);
                                }
                            }
                        }
                        sendBanco.send(JSON.stringify(data));
                    });
                }

                toggleLoader();
            } else {
                response.innerHTML = `<p class="text-red-500">Erro ao Enviar!</p>`;
            }
        };

        xhr.onerror = function () {
            response.innerHTML = `<p class="text-red-500">Erro de conexão!</p>`;
        };
        btn.disabled = true;
        xhr.send(formData);
    });

    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => e.preventDefault());
    });

    ["dragenter", "dragover"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add("border-green-500"));
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove("border-green-500"));
    });

    dropArea.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        fileInput.files = files;
        showFileList(files);
        toggleButton();
    });

    function toggleButton() {
        btn.disabled = !btn.disabled;
        btn.classList.remove('bg-gray-300');
        btn.classList.add('bg-green-300');
        btn.classList.remove('cursor-not-allowed');
        btn.classList.add('cursor-pointer');
        btn.classList.add('hover:bg-green-400');
    }

    function showFileList(files) {
        fileList.innerHTML = "<ul class='mt-2'>"; // Inicia a lista
        for (const file of files) {
            fileList.innerHTML += `<li class="text-gray-600">${file.name}</li>`;
        }
        fileList.innerHTML += "</ul>";
    }

    fileInput.addEventListener("change", (e) => {
        toggleButton();
        showFileList(e.target.files);
    });

    function listaPedidos(empresa, nome) {
        const listaPedidos = document.createElement("ul");
        listaPedidos.id = `listaPedidos${nome}`;
        if (nome === "Petronas")
            listaPedidos.classList.add("list-none", "mt-2", "hidden");
        else
            listaPedidos.classList.add("list-none", "mt-2");
        empresa.forEach((pedido, index) => {
            const li = document.createElement("li");
            li.textContent = pedido + (index !== empresa.length - 1 ? "," : "");
            listaPedidos.appendChild(li);
        });
        response.appendChild(listaPedidos);
    }
});


