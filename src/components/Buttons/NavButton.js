import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const NavButton = ({ to, label, disabled }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (!disabled) {
            navigate(to);
        }
    };

    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={handleClick}
            disabled={disabled}
        >
            {label}
        </Button>
    );
};

export default NavButton;

