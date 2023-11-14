function changeStatus(id) {
    alert(orderId)
    alert(changeStatus)
        var selectedStatus = document.getElementById('statusChange').value;
        
        console.log('Selected Status:', selectedStatus);
        fetch('/updateStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: orderId, status: statusChange }),
        })
        .then(response => response.json())
        .then(data => console.log('Updated Status:', data))
        .catch(error => console.error('Error updating status:', error));
    }







