CREATE TABLE AssetAssignments (
    AssignmentID INT IDENTITY(1,1) PRIMARY KEY,
	AssignmentCode NVARCHAR(20) NOT NULL,
    EmployeeID INT NOT NULL, -- Người được giao hoặc thu hồi tài sản
    AssignmentAction NVARCHAR(20) NOT NULL,
    AssignmentDate DATETIME2 DEFAULT GETDATE(),  -- Ngày thực hiện
    Notes NVARCHAR(MAX),
    AssignmentBy INT NOT NULL,  -- Nhân viên thực hiện lệnh giao/thu
	AssignStatus NVARCHAR(MAX),
	CreateAt DATETIME2 DEFAULT GETDATE(),
	UpdateAt DATETIME2 DEFAULT GETDATE()
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
    FOREIGN KEY (AssignmentBy) REFERENCES Employees(EmployeeID)
);

CREATE TABLE AssetAssignmentDetails (
    DetailID INT IDENTITY(1,1) PRIMARY KEY,
    AssignmentID INT NOT NULL,
    AssetID INT NOT NULL,
    FOREIGN KEY (AssignmentID) REFERENCES AssetAssignments(AssignmentID),
    FOREIGN KEY (AssetID) REFERENCES Assets(AssetID)
);


EXEC Asset_GetDetailByTag @AssetTag = 'IT000005'