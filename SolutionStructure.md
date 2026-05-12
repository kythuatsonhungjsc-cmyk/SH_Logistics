src/
├── TaskManagement.Domain/
│   ├── Entities/
│   │   ├── User.cs
│   │   ├── TaskItem.cs
│   │   └── AuditLog.cs
│   ├── Enums/
│   │   ├── TaskStatus.cs
│   │   ├── Priority.cs
│   │   └── UserRole.cs
│   ├── Events/
│   │   ├── TaskCreatedEvent.cs
│   │   ├── TaskAssignedEvent.cs
│   │   ├── TaskStatusChangedEvent.cs
│   │   └── IDomainEvent.cs
│   └── Services/
│       └── TaskDomainService.cs   (nếu cần logic phức tạp)
├── TaskManagement.Application/
│   ├── Tasks/Commands/...
│   ├── Tasks/Queries/...
│   └── Common/Interfaces/...
├── TaskManagement.Infrastructure/
└── TaskManagement.Api/
