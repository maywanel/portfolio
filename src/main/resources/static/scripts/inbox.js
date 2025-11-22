const inboxTable = document.getElementById('inboxTable');
const inboxStatus = document.getElementById('inboxStatus');
const refreshButton = document.getElementById('refreshInbox');

function formatDate(isoString) {
    if (!isoString) {
        return '–';
    }
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
        return isoString;
    }
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function setStatus(message, tone = 'info') {
    if (!inboxStatus) {
        return;
    }

    inboxStatus.className = `inbox__status inbox__status--${tone}`;
    inboxStatus.textContent = message;
}

function renderMessages(messages) {
    if (!inboxTable) {
        return;
    }

    const tbody = inboxTable.querySelector('tbody');
    tbody.innerHTML = '';

    if (!messages.length) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" class="inbox__empty">No submissions yet.</td>';
        tbody.appendChild(row);
        setStatus('Inbox is empty.', 'info');
        return;
    }

    messages
        .slice()
        .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
        .forEach(message => {
            const row = document.createElement('tr');

            const receivedCell = document.createElement('td');
            receivedCell.textContent = formatDate(message.receivedAt);
            row.appendChild(receivedCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = message.name || '';
            row.appendChild(nameCell);

            const emailCell = document.createElement('td');
            if (message.email) {
                const emailLink = document.createElement('a');
                emailLink.href = `mailto:${message.email}`;
                emailLink.textContent = message.email;
                emailLink.rel = 'noopener';
                emailLink.target = '_blank';
                emailCell.appendChild(emailLink);
            }
            row.appendChild(emailCell);

            const messageCell = document.createElement('td');
            const pre = document.createElement('pre');
            pre.textContent = message.message || '';
            messageCell.appendChild(pre);
            row.appendChild(messageCell);

            tbody.appendChild(row);
        });

    setStatus(`Showing ${messages.length} message${messages.length === 1 ? '' : 's'}.`, 'success');
}

async function loadMessages() {
    setStatus('Loading messages…', 'info');

    try {
        const response = await fetch(buildApiUrl('/api/contact'), {
            headers: {
                'Accept': 'application/json'
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        renderMessages(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error('Failed to load contact messages', error);
        setStatus('Unable to load messages. Ensure the backend is running and try again.', 'error');
    }
}

if (refreshButton) {
    refreshButton.addEventListener('click', loadMessages);
}

document.addEventListener('DOMContentLoaded', () => {
    if (inboxStatus) {
        loadMessages();
    }
});
