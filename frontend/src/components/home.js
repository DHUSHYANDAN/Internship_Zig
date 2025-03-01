import React, { useState, useEffect } from "react";
import baseUrl from "../URL";

const Home = () => {
    const [url, setUrl] = useState("");
    const [siteManager, setSiteManager] = useState("");
    const [email, setEmail] = useState("");
    const [certificates, setCertificates] = useState([]);
    const [isValid, setIsValid] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${baseUrl}/certificates`)
            .then(res => res.json())
            .then(data => setCertificates(data))
            .catch(err => console.log(err));
    }, []);

    const validateUrl = (value) => {
        const urlPattern = new RegExp("^(https?:\\/\\/)?"+ 
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|"+
            "((\\d{1,3}\\.){3}\\d{1,3}))"+
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*"+
            "(\\?[;&a-z\\d%_.~+=-]*)?"+
            "(\\#[-a-z\\d_]*)?$","i");
        return !!urlPattern.test(value);
    };

    const handleChange = (e) => {
        setUrl(e.target.value);
        setIsValid(validateUrl(e.target.value));
    };

    const handleFetch = async () => {
        if (!isValid) return alert("Enter a valid URL");

        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/fetch-certificate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url, site_manager: siteManager, email })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch SSL data");
            }
            setCertificates([...certificates, data]);
        } catch (error) {
            alert(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Monitor SSL Certificate</h1>

            <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
                <input
                    type="text"
                    value={url}
                    onChange={handleChange}
                    className={`w-full p-2 border ${isValid ? 'border-gray-300' : 'border-red-500'} rounded mb-3`}
                    placeholder="Enter website URL"
                />
               
                <button
                    onClick={handleFetch}
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "Fetching..." : "Fetch Certificate"}
                </button>
            </div>

            <h2 className="text-2xl font-bold mt-6">Stored Certificates</h2>
            <div className="w-full max-w-2xl mt-4 bg-white p-4 rounded shadow-md">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">URL</th>
                            <th className="border p-2">Issuer</th>
                            <th className="border p-2">Valid From</th>
                            <th className="border p-2">Valid To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificates.map((cert, index) => (
                            <tr key={index} className="text-center">
                                <td className="border p-2">{cert.url}</td>
                                <td className="border p-2">{cert.issuer}</td>
                                <td className="border p-2">{cert.valid_from}</td>
                                <td className="border p-2">{cert.valid_to}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;
