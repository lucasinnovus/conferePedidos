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

                listaPedidos(cativo, "cativo");
                listaPedidos(petronas, "petronas");

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

                const buttonPetronas = createSendButton('petronas', petronas);
                const buttonCativo = createSendButton('cativo', cativo);
                handleList.addEventListener('click', function (e) {
                    const listaPedidosPetronas = document.getElementById('listaPedidospetronas');
                    const listaPedidosCativo = document.getElementById('listaPedidoscativo');
                    listaPedidosCativo.classList.toggle('hidden');
                    listaPedidosPetronas.classList.toggle('hidden')
                    if (e.target.textContent === 'Pedidos Petronas') {
                        e.target.textContent = 'Pedidos Cativo';
                        petronas.length !== 0 ? litrosSpan.textContent = `Litros Totais: ${litrosTotaisPetronas}` : litrosSpan.textContent = '';
                        buttonPetronas.classList.toggle('hidden');
                        buttonCativo.classList.toggle('hidden');
                    } else {
                        e.target.textContent = 'Pedidos Petronas';
                        litrosSpan.textContent = `Litros Totais: ${litrosTotaisCativo}`
                        buttonCativo.classList.toggle('hidden');
                        buttonPetronas.classList.toggle('hidden');
                    }
                })
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
        nome === 'petronas' ? listaPedidos.classList.add("list-none", "flex", "flex-col", "gap-1", "mt-2", "hidden") : listaPedidos.classList.add("list-none", "flex", "flex-col", "gap-1", "mt-2");
        if (empresa.length === 0) {
            const li = document.createElement("li");
            li.textContent = 'Nenhum pedido encontrado!';
            listaPedidos.appendChild(li);
        } else {
            empresa.forEach((pedido, index) => {
                const li = document.createElement("li");
                li.id = pedido;
                li.textContent = pedido + (index !== empresa.length - 1 ? "," : "");
                listaPedidos.appendChild(li);
            });
        }

        response.appendChild(listaPedidos);
    }

    function createSendButton(nome, pedidos) {
        let sendButton = document.createElement("button");
        sendButton.type = "button";
        sendButton.id = `button-${nome}`;
        const textoOriginal = nome === 'petronas' ? 'Cancelar Pedidos' : 'Enviar Pedidos';
        sendButton.textContent = textoOriginal;
        nome === 'petronas' ? sendButton.classList.add('hidden', 'bg-red-300', 'hover:bg-red-400') : sendButton.classList.add('bg-green-300', 'hover:bg-green-400');
        sendButton.classList.add("mt-2", "w-48", "font-bold", "cursor-pointer", "bg-green-300", "hover:bg-green-400", "transition", "duration-150", "rounded-md", "p-2");
        response.appendChild(sendButton);
        sendButton.addEventListener("click", function () {
            if (typeof pedidos === 'undefined' || !Array.isArray(pedidos) || pedidos.length === 0) {
                alert('Nenhum pedido a enviar!');
                return;
            }
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "enviarBanco.php", true);
            xhr.setRequestHeader("Content-Type", "application/json");

            sendButton.disabled = true;
            sendButton.textContent = "Processando...";

            const data = {
                [nome]: pedidos
            };

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    sendButton.disabled = false;
                    sendButton.textContent = textoOriginal;
                    try {
                        const json = JSON.parse(xhr.responseText);
                        const listaLi = document.getElementById(`listaPedidos${nome}`).getElementsByTagName('li');
                        for (const elements of listaLi) {
                            if (json.status !== 'Success') {
                                json.forEach(erros => {
                                    if (erros.pedido !== elements.id) {
                                        elements.classList.add('bg-success', 'text-success-content');
                                    }
                                })
                            }
                            elements.classList.remove('bg-error', "text-error-content", "tooltip", "tooltip-content", "tooltip-right");
                        }
                        if (json.status === 'Success') {
                            alert('Solicitação concluída com sucesso!')
                        } else {
                            json.forEach(erros => {
                                const idErros = document.getElementById(`('${erros.pedido}')`);
                                idErros.classList.remove('bg-success', 'text-success-content');
                                idErros.setAttribute('data-tip', `${erros.message}`);
                                idErros.classList.add('bg-error', "text-error-content", "tooltip", "tooltip-error", "tooltip-content", "tooltip-right");
                            });
                            alert('Sucesso Parcial: Chaves Duplicadas Encontradas...');
                        }
                    } catch (err) {
                        console.log('Erro ao buscar pedidos', err);
                        console.log("Resposta do servidor:", xhr.responseText);
                    }
                }
            }
            xhr.send(JSON.stringify(data));
        });
        return sendButton;
    }
});


