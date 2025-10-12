import React, { useState, useEffect } from "react";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  UserPlus,
  Mail,
  Phone,
  Crown,
  Shield,
  User,
  Search,
  Filter,
  MoreVertical,
  ArrowUp,
  UserCheck,
  Loader2,
} from "lucide-react";
import { MEMBER_ROLES } from "../../util/constant.js";
import axios from "axios";
import { Baseurl } from "../../main.jsx";
import { toast } from "react-toastify";

const Member = ({ club }) => {
  const [activeTab, setActiveTab] = useState("members");
  const [members, setMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch members data
  useEffect(() => {
    if (club) {
      fetchMembers();
    }
  }, [club]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${Baseurl}/member/allmembers/${club}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Fix: Access the correct data structure from API response
      const allMembers = res.data?.data || [];

      // Fix: Use correct field names (Status with capital S, not status)
      const activeMembers = allMembers.filter(
        (member) => member.Status?.toLowerCase() !== "pending"
      );
      const pendingMembersList = allMembers.filter(
        (member) => member.Status?.toLowerCase() === "pending"
      );

      setMembers(activeMembers);
      setPendingMembers(pendingMembersList);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter members based on search and status
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      (member.UserId?.fullName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (member.UserId?.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      member.Status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredPendingMembers = pendingMembers.filter(
    (member) =>
      (member.UserId?.fullName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (member.UserId?.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Handle role change/upgrade
  const handleRoleChange = async (memberId, selectedRole) => {
    if (!selectedRole) return;

    setActionLoading((prev) => ({ ...prev, [memberId]: true }));
    if (selectedRole === "Remove") {
      try {
        const res = await axios.post(
          `${Baseurl}/member/remove/${memberId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

         if(res.data.success)
             setMembers((prev) => prev.filter((member) => member._id !== memberId));
        toast.error(res.data.message)
      } catch (error) {
        console.error("Error upgrading member:", error);
      } finally {
        setActionLoading((prev) => ({ ...prev, [memberId]: false }));
      }
    } else {
      try {
        const res = await axios.post(
          `${Baseurl}/member/upgrade`,
          {
            memberId: memberId,
            Role: selectedRole,
            club: club,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        // Update local state
        setMembers((prev) =>
          prev.map((member) =>
            member._id === memberId
              ? { ...member, Status: selectedRole }
              : member
          )
        );
      } catch (error) {
        console.error("Error upgrading member:", error);
      } finally {
        setActionLoading((prev) => ({ ...prev, [memberId]: false }));
      }
    }
  };

  // Handle approve pending member
  const handleApproveMember = async (memberId) => {
    setActionLoading((prev) => ({ ...prev, [memberId]: true }));

    try {
      // Assuming you have an approve endpoint
      await axios.post(
        `${Baseurl}/member/approve/${memberId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Move from pending to active members
      const memberToApprove = pendingMembers.find(
        (member) => member._id === memberId
      );
      if (memberToApprove) {
        setMembers((prev) => [
          ...prev,
          { ...memberToApprove, Status: "Member" },
        ]);
        setPendingMembers((prev) =>
          prev.filter((member) => member._id !== memberId)
        );
      }
    } catch (error) {
      console.error("Error approving member:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  // Handle reject pending member
  const handleRejectMember = async (memberId) => {
    setActionLoading((prev) => ({ ...prev, [memberId]: true }));

    try {
      // Assuming you have a reject endpoint
      await axios.post(
        `${Baseurl}/member/reject/${memberId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setPendingMembers((prev) =>
        prev.filter((member) => member._id !== memberId)
      );
    } catch (error) {
      console.error("Error rejecting member:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    console.log("Rendering status badge for status:", status);
    const normalizedStatus = status?.toLowerCase();
    const statusConfig = {
      admin: {
        icon: Crown,
        color: "bg-purple-100 text-purple-800",
        label: "Admin",
      },
      president: {
        icon: Crown,
        color: "bg-blue-100 text-blue-800",
        label: "President",
      },
      member: {
        icon: User,
        color: "bg-green-100 text-green-800",
        label: "Member",
      },
      pending: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending",
      },
    };

    const config = statusConfig[normalizedStatus] || statusConfig.member;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getRoleUpgradeSelect = (member) => {
    const isLoading = actionLoading[member._id];
    const currentStatus = member.Status?.toLowerCase();
    const availableRoles = MEMBER_ROLES.filter(
      (role) => role.toLowerCase() !== currentStatus
    );
    availableRoles.push("Remove");
    // console.log("avail",availableRoles);

    if (availableRoles.length === 0) return null;

    return (
      <select
        key={`select-${member._id}-${member.Status}`} // Force re-render when status changes
        data-member-id={member._id}
        onChange={(e) => {
          console.log("Select changed:", e.target.value);
          handleRoleChange(member._id, e.target.value);
        }}
        disabled={isLoading}
        defaultValue=""
        className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Upgrade To...</option>
        {availableRoles.map((role) => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    );
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
          <p className="text-center text-gray-600 mt-4 font-medium">
            Loading members...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Member Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your club members and pending applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Applications
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingMembers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Admins & Moderators
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    members.filter(
                      (m) =>
                        m.Status?.toLowerCase() === "admin" ||
                        m.Status?.toLowerCase() === "moderator"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("members")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "members"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Active Members ({members.length})
                </div>
              </button>

              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "pending"
                    ? "border-yellow-500 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Pending Applications ({pendingMembers.length})
                </div>
              </button>
            </nav>
          </div>

          {/* Search and Filter Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {activeTab === "members" && (
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    {MEMBER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Members Table */}
          {activeTab === "members" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr
                      key={member._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {(member.UserId?.fullName || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.UserId?.fullName || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {member.UserId?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {member.UserId?.contact || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(member.Role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(member.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2 justify-end">
                          {actionLoading[member._id] && (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                          )}
                          {getRoleUpgradeSelect(member)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No members found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pending Members Table */}
          {activeTab === "pending" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPendingMembers.map((member) => (
                    <tr
                      key={member._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {(member.UserId?.fullName || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.UserId?.fullName || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {member.UserId?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {member.UserId?.contact || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(member.Status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(member.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2 justify-end">
                          <button
                            onClick={() => handleApproveMember(member._id)}
                            disabled={actionLoading[member._id]}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            {actionLoading[member._id] ? (
                              <Loader2 className="w-3 h-3 animate-spin mr-1" />
                            ) : (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            Approve
                          </button>

                          <button
                            onClick={() => handleRejectMember(member._id)}
                            disabled={actionLoading[member._id]}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPendingMembers.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No pending applications
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All applications have been processed.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Member;
