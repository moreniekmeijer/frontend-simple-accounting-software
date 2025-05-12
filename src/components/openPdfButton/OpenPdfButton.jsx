import Button from "../button/Button.jsx";

function OpenPdfButton({ driveUrl, invoiceNumber }) {
    const handleOpenClick = () => {
        if (driveUrl) {
            window.open(driveUrl, "_blank", "noopener,noreferrer");
        } else {
            alert("De PDF-link is niet beschikbaar.");
        }
    };

    return (
        <Button variant="simple" onClick={handleOpenClick}>
            {invoiceNumber ? `Bekijk ${invoiceNumber}` : "Open PDF"}
        </Button>
    );
}

export default OpenPdfButton;
