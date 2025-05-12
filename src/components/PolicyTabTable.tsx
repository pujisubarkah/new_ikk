// components/PolicyTabTable.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa"; // Eye icon for view details
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // For displaying notifications
import SendPolicyDialog from "./SendPolicyDialog"; // Import the dialog component
// If SendPolicyDialog exports its props type, you can import it:
// import type { SendPolicyDialogProps } from "./SendPolicyDialog";

// Interface defining the structure of a Policy object after mapping
interface Policy {
  id: number;
  nama: string; // Policy name
  sektor: string; // Sector (might be needed for display/filtering later)
  tanggal: string; // Formatted effective date
  file: string; // URL to the policy file or "-"
  enumerator: string; // Assigned analyst/enumerator name or "Belum ditetapkan"
  progress: string; // Progress percentage string (e.g., "75%")
  tanggalAssign: string; // Formatted assignment/processing date
  nilai: string; // Score/value for completed policies or "-"
  status: string; // Mapped status (e.g., "DIAJUKAN", "DISETUJUI", "PROSES", "SELESAI")
  instansi: string; // Agency name or "-"
}

// Interface defining the structure of an Analyst object for selection
interface Analyst {
  id: number;
  name: string;
}

// The main component function
export default function PolicyTabTable() {
  // State variables
  const [activeTab, setActiveTab] = useState("Diajukan"); // Currently active tab
  const [data, setData] = useState<Policy[]>([]); // Holds the full list of policies fetched for the *current* endpoint
  const [currentPage, setCurrentPage] = useState(1); // Current page number for pagination
  const [isLoading, setIsLoading] = useState(true); // Loading state indicator
  const [analysts, setAnalysts] = useState<Analyst[]>([]); // List of analysts for assignment modal
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null); // Policy selected for analyst assignment
  const [openAnalystModal, setOpenAnalystModal] = useState(false); // Controls visibility of the analyst assignment modal
  const [selectedAnalystId, setSelectedAnalystId] = useState<number | null>(null); // ID of the analyst selected in the modal
  const router = useRouter(); // Next.js router for navigation

  // Map user-friendly tab names to backend status identifiers
  const statusMap = {
    "Diajukan": "DIAJUKAN",
    "Disetujui": "DISETUJUI",
    "Diproses": "PROSES",
    "Selesai": "SELESAI"
  };

  // --- Data Filtering and Pagination ---
  // Filter the fetched 'data' based on the 'activeTab' status
  const filteredData = data.filter((item) =>
      item.status === statusMap[activeTab as keyof typeof statusMap]
  );

  const itemsPerPage = 5; // Number of items to display per page
  const totalPages = Math.ceil(filteredData.length / itemsPerPage); // Calculate total pages needed
  const startIndex = (currentPage - 1) * itemsPerPage; // Calculate starting index for slicing
  // Get the slice of data for the current page
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  // Determine max columns for table layout consistency (used in colSpan)
  const maxColumns = activeTab === "Diproses" ? 6 : 5;

  // --- Data Fetching Functions ---

  // Fetches policies based on the active tab
  const fetchPolicies = async () => {
    setIsLoading(true); // Start loading indicator
    setData([]); // Clear previous data while fetching new data
    try {
      // Retrieve admin/coordinator ID from local storage
      const adminInstansiId = localStorage.getItem("id");
      console.log('Admin/Coordinator ID:', adminInstansiId); // Debug log

      if (!adminInstansiId) {
        toast.error("ID admin/koordinator instansi tidak ditemukan di local storage.");
        setIsLoading(false); // Stop loading
        return;
      }

      // Determine API endpoint based on the active tab
      let endpoint = "";
      switch (activeTab) {
        case "Diajukan":
          endpoint = `/api/policies/${adminInstansiId}/diajukan`;
          break;
        case "Disetujui":
          endpoint = `/api/policies/${adminInstansiId}/disetujui`;
          break;
        case "Diproses":
          endpoint = `/api/policies/${adminInstansiId}/diproses`;
          break;
        case "Selesai":
          endpoint = `/api/policies/${adminInstansiId}/selesai`;
          break;
        default:
          // Fallback or error handling if tab name is unexpected
          console.error("Invalid active tab:", activeTab);
          toast.error("Tab tidak valid.");
          setIsLoading(false);
          return;
      }

      console.log('Fetching policies from endpoint:', endpoint); // Debug log
      const res = await axios.get(endpoint);
      console.log('API Response:', res.data); // Debug log

      // Extract policy data, defaulting to an empty array if not found
      const fetchedData = res.data?.data || [];

      // Map the raw fetched data to the Policy interface structure
      const mappedData = Array.isArray(fetchedData)
        ? fetchedData.map((item: { 
            id: string; 
            nama_kebijakan?: string; 
            sektor?: string; 
            tanggal_berlaku?: string; 
            file_url?: string; 
            enumerator?: { nama?: string }; 
            nama_analis?: string; 
            analis?: { nama?: string }; 
            progress?: number; 
            tanggal_proses?: string; 
            tanggal_assign?: string; 
            nilai?: string; 
            instansi?: { nama?: string }; 
            nama_instansi?: string; 
            proses?: string; 
            status?: string; 
          }) => ({
            id: parseInt(item.id, 10),
            nama: item.nama_kebijakan || "-",
            sektor: item.sektor || "-", // Include sector if available
            tanggal: item.tanggal_berlaku
              ? new Date(item.tanggal_berlaku).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' }) // Format date
              : "-",
            file: item.file_url || "-", // Use file_url or adjust field name
            // Attempt to get analyst name from possible fields
            enumerator: item.enumerator?.nama || item.nama_analis || item.analis?.nama || "Belum ditetapkan",
            progress: item.progress
              ? `${item.progress}%` // Format progress as percentage string
              : "0%",
            // Use the most relevant date for assignment/processing
            tanggalAssign: item.tanggal_proses || item.tanggal_assign
              ? new Date(item.tanggal_proses ?? item.tanggal_assign ?? "").toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' }) // Format date
              : "-",
            nilai: item.nilai || "-", // Get score if available
            // Attempt to get agency name from possible fields
            instansi: item.instansi?.nama || item.nama_instansi || "-",
            // Map backend status field to our 'status' field
            status: item.proses || item.status || "-", // Adjust field name as needed
          }))
        : [];

      console.log('Mapped Policy Data:', mappedData); // Debug log
      setData(mappedData); // Update state with the mapped data
    } catch (err) {
      console.error("Gagal fetch data policies:", err);
      toast.error("Gagal memuat data kebijakan.");
      setData([]); // Ensure data is empty on error
    } finally {
      setIsLoading(false); // Stop loading indicator regardless of success/failure
    }
  };

  // Fetches the list of analysts for assignment
  const fetchAnalysts = async () => {
    // Assuming the same ID is used for fetching analysts
    const koorinstansiId = localStorage.getItem("id");
    setAnalysts([]); // Clear previous list
    try {
      if (!koorinstansiId) {
        toast.error("ID koordinator instansi tidak ditemukan.");
        return;
      }

      // API endpoint to get analysts linked to the coordinator
      const res = await axios.get(`/api/koorinstansi/${koorinstansiId}/analis`);
      console.log('Fetched Analysts:', res.data); // Debug log

      // Map the response data to the Analyst interface
      const fetchedAnalysts = (res.data?.data || res.data || []).map((analyst: { id: string; nama?: string; name?: string }) => ({
         id: parseInt(analyst.id, 10),
         // Look for name in common properties
         name: analyst.nama || analyst.name || "Nama Analis Tidak Tersedia"
      }));
      setAnalysts(fetchedAnalysts);
    } catch (err) {
      console.error("Gagal fetch daftar analis:", err);
      toast.error("Gagal memuat daftar analis.");
      setAnalysts([]); // Ensure list is empty on error
    }
  };

  // --- useEffect Hooks ---

  // Fetch policies whenever the activeTab changes
  useEffect(() => {
    fetchPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); // Dependency array ensures this runs only when activeTab changes

  // Fetch analysts only when the assignment modal is opened
  useEffect(() => {
    if (openAnalystModal) {
      fetchAnalysts();
    }
  }, [openAnalystModal]); // Dependency array ensures this runs when modal visibility changes

  // --- Event Handlers ---

  // Handles changing the active tab
  const handleTabChange = (status: string) => {
    setActiveTab(status); // Update the active tab state
    setCurrentPage(1); // Reset pagination to the first page
    // Data fetching is triggered by the useEffect hook watching activeTab
  };

  // Handles clicking the button to assign an analyst
  const handleAssignAnalystClick = (policy: Policy) => {
    setSelectedPolicy(policy); // Store the policy being assigned
    setOpenAnalystModal(true); // Open the assignment modal
    // Fetching analysts is triggered by the useEffect hook watching openAnalystModal
  };

  // Handles submitting the selected analyst for the selected policy
  const handleSubmitAnalyst = async () => {
    if (!selectedPolicy || !selectedAnalystId) {
      toast.error("Harap pilih kebijakan dan analis terlebih dahulu.");
      return;
    }

    try {
      // Prepare data payload, ensuring IDs are in the format expected by the API (e.g., string)
      const policyId = String(selectedPolicy.id);
      const analystId = String(selectedAnalystId);

      // API endpoint for assigning analyst/enumerator
      const res = await axios.post("/api/policies/pilih-enumerator", {
        policyId,
        analystId,
      });

      // Check for successful status codes (200 OK, 201 Created)
      if (res.status === 200 || res.status === 201) {
        toast.success("Analis instansi berhasil ditetapkan.");
        setOpenAnalystModal(false); // Close the modal
        setSelectedPolicy(null); // Clear selected policy
        setSelectedAnalystId(null); // Clear selected analyst
        // Refresh the policy list for the current tab to show the update
        fetchPolicies();
      } else {
        // Handle unexpected success status codes
        throw new Error(res.data?.message || `Gagal menetapkan analis (Status: ${res.status})`);
      }
    } catch (err) {
      console.error("Gagal menetapkan analis:", err);
      let errorMessage = "Terjadi kesalahan saat menetapkan analis.";
      // Extract more specific error message from AxiosError response if available
      if (axios.isAxiosError(err) && err.response?.data?.message) {
         errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
         errorMessage = err.message; // Use generic error message
      }
      toast.error(errorMessage);
    }
  };

  // --- JSX Rendering ---
  return (
    <>
      {/* "Kirim Kebijakan" Button - Only shown on "Diajukan" tab if there are policies */}
      {activeTab === "Diajukan" && filteredData.length > 0 && ( // Show button only if there are items in the *filtered* data for this tab
        <div className="mt-6 flex justify-end">
          {/* Corrected Usage: Pass button props directly to SendPolicyDialog */}
          <SendPolicyDialog
            onSend={() => {
                console.log("Callback after policy sent from dialog");
                // Potentially refresh data or perform other actions after sending
                fetchPolicies();
            }}
          >
            <button
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-md hover:bg-green-700 transition-colors duration-200"
              type="button" // Explicitly set type if needed
            >
              {/* Content of the button */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              Kirim Kebijakan ke Pusat
            </button>
          </SendPolicyDialog>
        </div>
      )}

      {/* Tabs for different policy statuses */}
      <div className="flex flex-wrap space-x-2 mb-6 mt-4">
        {Object.keys(statusMap).map((statusKey) => (
          <button
            key={statusKey}
            onClick={() => handleTabChange(statusKey)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm mb-2 ${
              activeTab === statusKey
                ? "bg-blue-600 text-white shadow-md" // Active tab style
                : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50" // Inactive tab style
            }`}
          >
            Kebijakan {statusKey}
          </button>
        ))}
      </div>

      {/* Policy Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {/* Common Columns */}
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">No</th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Nama Kebijakan</th>

              {/* Conditional Columns based on Active Tab */}
              {activeTab === "Diajukan" && (
                <>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Tanggal Berlaku</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">File</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
                </>
              )}

              {activeTab === "Disetujui" && (
                <>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Analis Instansi</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Tanggal Berlaku</th>
                  <th className="px-4 py-3 text-center text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                </>
              )}

              {activeTab === "Diproses" && (
                <>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Analis Instansi</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Progress</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Tanggal Assign</th>
                  <th className="px-4 py-3 text-center text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                </>
              )}

              {activeTab === "Selesai" && (
                <>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Analis Instansi</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Nilai</th>
                  <th className="px-4 py-3 text-center text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              // Loading State Row
              <tr>
                <td colSpan={maxColumns} className="px-4 py-6 text-center text-gray-500">
                  <div className="flex justify-center items-center space-x-2">
                     <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     <span>Memuat data kebijakan...</span>
                  </div>
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              // Data Rows
              currentData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                  {/* Common Cells */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{startIndex + index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium border-r">{item.nama}</td>

                  {/* Conditional Cells based on Active Tab */}
                  {activeTab === "Diajukan" && (
                    <>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.tanggal}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r">
                        {item.file && item.file !== "-" ? (
                          <a
                            href={item.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150"
                            title={`Lihat file ${item.nama}`} // Add title for accessibility
                          >
                            Lihat File
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {/* Status Badge */}
                        <span
                          className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === "DISETUJUI" // Assuming backend might send this status even in 'Diajukan' if pre-approved? Adjust if needed.
                              ? "bg-green-100 text-green-800"
                              : item.status === "DITOLAK" // Handle rejected status if applicable
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800" // Default 'Diajukan' style
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </>
                  )}

                  {activeTab === "Disetujui" && (
                    <>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.enumerator}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.tanggal}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm font-medium">
                        {/* Action Button: Assign Analyst */}
                        <button
                          onClick={() => handleAssignAnalystClick(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md shadow-sm transition duration-150 text-xs"
                          title={`Pilih analis untuk ${item.nama}`}
                        >
                          Pilih Analis
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "Diproses" && (
                    <>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.enumerator}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r min-w-[100px]">
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: item.progress || "0%" }} // Ensure width is valid
                            title={`Progress: ${item.progress}`}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block text-center">{item.progress}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.tanggalAssign}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm font-medium">
                        {/* Action Button: View Details */}
                        <button
                          onClick={() => router.push(`/koordinator-instansi/daftar-kebijakan/prosesdetail/${item.id}`)}
                          className="text-blue-600 hover:text-blue-800 p-1 transition-colors duration-150"
                          title={`Lihat detail proses ${item.nama}`}
                        >
                          <FaEye size={18} />
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "Selesai" && (
                    <>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.enumerator}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.nilai}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm font-medium">
                        {/* Action Button: View Final Details */}
                        <button
                          onClick={() => router.push(`/koordinator-instansi/daftar-kebijakan/selesaidetail/${item.id}`)} // Use a different detail route for finished items if needed
                          className="text-green-600 hover:text-green-800 p-1 transition-colors duration-150"
                          title={`Lihat detail hasil ${item.nama}`}
                        >
                           <FaEye size={18} />
                           {/* Keep the original icon if preferred */}
                           {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"> ... </svg> */}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              // Empty State Row
              <tr>
                <td colSpan={maxColumns} className="px-4 py-6 text-center text-gray-500 border-t">
                  Tidak ada data kebijakan untuk status &quot;{activeTab}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-1 sm:space-x-2">
          {/* Previous Page Button (Optional) */}
          <button
             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
             disabled={currentPage === 1}
             className={`px-3 py-1.5 rounded-md text-sm font-semibold ${currentPage === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
           >
             &laquo; Prev
           </button>

          {/* Page Number Buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow-sm" // Active page style
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50" // Inactive page style
              }`}
            >
              {page}
            </button>
          ))}

           {/* Next Page Button (Optional) */}
           <button
             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
             disabled={currentPage === totalPages}
             className={`px-3 py-1.5 rounded-md text-sm font-semibold ${currentPage === totalPages ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
           >
             Next &raquo;
           </button>
        </div>
      )}

      {/* Analyst Assignment Modal */}
      {openAnalystModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-out">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 m-4 transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale">
             {/* Modal Header */}
             <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h3 className="text-xl font-semibold text-gray-800">Pilih Analis Instansi</h3>
                 <button onClick={() => setOpenAnalystModal(false)} className="text-gray-400 hover:text-gray-600">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                     </svg>
                 </button>
             </div>

            {/* Modal Body */}
            <p className="mb-5 text-sm text-gray-600">
              Pilih analis yang akan ditugaskan untuk memproses kebijakan: <br/>
              <span className="font-semibold text-gray-800">{selectedPolicy.nama}</span>
            </p>

            <div className="mb-6">
              <label htmlFor="analystSelect" className="block text-sm font-medium text-gray-700 mb-1">Analis Tersedia</label>
              <select
                id="analystSelect"
                value={selectedAnalystId || ""} // Controlled component
                onChange={(e) => setSelectedAnalystId(Number(e.target.value))} // Update state on change
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-sm"
                disabled={analysts.length === 0} // Disable if no analysts loaded
              >
                <option value="" disabled>
                    {analysts.length === 0 ? "Memuat atau tidak ada analis..." : "-- Pilih Analis --"}
                </option>
                {/* Map available analysts to options */}
                {analysts.map((analyst) => (
                  <option key={analyst.id} value={analyst.id}>
                    {analyst.name} (ID: {analyst.id})
                  </option>
                ))}
              </select>
              {analysts.length === 0 && !isLoading && ( // Show message if fetch finished with no analysts
                 <p className="text-xs text-red-600 mt-1">Tidak ada analis yang tersedia untuk instansi ini.</p>
              )}
            </div>

            {/* Modal Footer/Actions */}
            <div className="flex justify-end space-x-3 border-t pt-4">
              <button
                type="button"
                onClick={() => setOpenAnalystModal(false)} // Close modal on cancel
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmitAnalyst} // Call submit handler on click
                disabled={!selectedAnalystId} // Disable button if no analyst is selected
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-150"
              >
                Tetapkan Analis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for Modal Animation (Optional - place in a global CSS file or <style jsx>) */}
      <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}