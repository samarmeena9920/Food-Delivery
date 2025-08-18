import { useSearchParams } from 'react-router-dom';

const Debug = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Debug Page</h1>
            <p><strong>Current URL:</strong> {window.location.href}</p>
            <p><strong>Success:</strong> {success}</p>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Search Params:</strong> {window.location.search}</p>
            
            <div style={{ marginTop: '30px' }}>
                <h3>All URL Parameters:</h3>
                {Array.from(searchParams.entries()).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
            </div>
        </div>
    );
};

export default Debug;
