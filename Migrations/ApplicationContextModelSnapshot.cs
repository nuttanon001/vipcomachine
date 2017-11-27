﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;
using VipcoMachine.Models;

namespace VipcoMachine.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    partial class ApplicationContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.0-rtm-26452")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("VipcoMachine.Models.AttachFile", b =>
                {
                    b.Property<int>("AttachFileId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("FileAddress")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<string>("FileName")
                        .HasMaxLength(100);

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.HasKey("AttachFileId");

                    b.ToTable("AttachFile");
                });

            modelBuilder.Entity("VipcoMachine.Models.ClassificationMaterial", b =>
                {
                    b.Property<int>("ClassificationId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClassificationCode")
                        .IsRequired()
                        .HasMaxLength(25);

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("Description")
                        .HasMaxLength(100);

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.HasKey("ClassificationId");

                    b.ToTable("ClassificationMaterial");
                });

            modelBuilder.Entity("VipcoMachine.Models.CuttingPlan", b =>
                {
                    b.Property<int>("CuttingPlanId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("CuttingPlanNo")
                        .IsRequired();

                    b.Property<string>("Description");

                    b.Property<string>("MaterialGrade");

                    b.Property<string>("MaterialSize");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<int?>("ProjectCodeDetailId");

                    b.Property<double?>("Quantity");

                    b.Property<int?>("TypeCuttingPlan");

                    b.HasKey("CuttingPlanId");

                    b.HasIndex("ProjectCodeDetailId");

                    b.ToTable("CuttingPlan");
                });

            modelBuilder.Entity("VipcoMachine.Models.Employee", b =>
                {
                    b.Property<string>("EmpCode")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("GroupCode")
                        .HasMaxLength(100);

                    b.Property<string>("GroupMIS")
                        .HasMaxLength(100);

                    b.Property<string>("GroupName")
                        .HasMaxLength(100);

                    b.Property<string>("NameEng")
                        .HasMaxLength(100);

                    b.Property<string>("NameThai")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Title")
                        .HasMaxLength(20);

                    b.Property<int?>("TypeEmployee");

                    b.HasKey("EmpCode");

                    b.HasIndex("GroupMIS");

                    b.ToTable("Employee");
                });

            modelBuilder.Entity("VipcoMachine.Models.EmployeeGroup", b =>
                {
                    b.Property<string>("GroupCode")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description")
                        .HasMaxLength(200);

                    b.Property<string>("Remark")
                        .HasMaxLength(200);

                    b.HasKey("GroupCode");

                    b.ToTable("EmployeeGroup");
                });

            modelBuilder.Entity("VipcoMachine.Models.EmployeeGroupMIS", b =>
                {
                    b.Property<string>("GroupMIS")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(100);

                    b.Property<string>("GroupDesc")
                        .HasMaxLength(250);

                    b.Property<string>("Remark")
                        .HasMaxLength(250);

                    b.HasKey("GroupMIS");

                    b.ToTable("EmployeeGroupMIS");
                });

            modelBuilder.Entity("VipcoMachine.Models.GradeMaterial", b =>
                {
                    b.Property<int>("GradeMaterialId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("GradeName")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.HasKey("GradeMaterialId");

                    b.ToTable("GradeMaterial");
                });

            modelBuilder.Entity("VipcoMachine.Models.JobCardDetail", b =>
                {
                    b.Property<int>("JobCardDetailId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<int?>("CuttingPlanId");

                    b.Property<int?>("JobCardDetailStatus");

                    b.Property<int?>("JobCardMasterId");

                    b.Property<string>("Material")
                        .HasMaxLength(200);

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<double?>("Quality");

                    b.Property<string>("Remark")
                        .HasMaxLength(200);

                    b.Property<int?>("StandardTimeId");

                    b.Property<int?>("UnitMeasureId");

                    b.Property<int?>("UnitNo");

                    b.HasKey("JobCardDetailId");

                    b.HasIndex("CuttingPlanId");

                    b.HasIndex("JobCardMasterId");

                    b.HasIndex("StandardTimeId");

                    b.HasIndex("UnitMeasureId");

                    b.ToTable("JobCardDetail");
                });

            modelBuilder.Entity("VipcoMachine.Models.JobCardMaster", b =>
                {
                    b.Property<int>("JobCardMasterId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("Description")
                        .HasMaxLength(200);

                    b.Property<DateTime?>("DueDate");

                    b.Property<string>("EmpRequire");

                    b.Property<string>("EmpWrite");

                    b.Property<string>("GroupCode");

                    b.Property<DateTime?>("JobCardDate");

                    b.Property<string>("JobCardMasterNo")
                        .HasMaxLength(50);

                    b.Property<int?>("JobCardMasterStatus");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<int?>("ProjectCodeDetailId");

                    b.Property<string>("Remark")
                        .HasMaxLength(200);

                    b.Property<int?>("TypeMachineId");

                    b.HasKey("JobCardMasterId");

                    b.HasIndex("EmpRequire");

                    b.HasIndex("EmpWrite");

                    b.HasIndex("GroupCode");

                    b.HasIndex("ProjectCodeDetailId");

                    b.HasIndex("TypeMachineId");

                    b.ToTable("JobCardMaster");
                });

            modelBuilder.Entity("VipcoMachine.Models.JobCardMasterHasAttach", b =>
                {
                    b.Property<int>("JobMasterHasAttachId")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("AttachFileId");

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<int?>("JobCardMasterId");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.HasKey("JobMasterHasAttachId");

                    b.HasIndex("AttachFileId");

                    b.HasIndex("JobCardMasterId");

                    b.ToTable("JobCardMasterHasAttach");
                });

            modelBuilder.Entity("VipcoMachine.Models.Machine", b =>
                {
                    b.Property<int>("MachineId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Brand")
                        .HasMaxLength(50);

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<DateTime?>("InstalledDate");

                    b.Property<string>("MachineCode")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<byte[]>("MachineImage");

                    b.Property<string>("MachineImageString");

                    b.Property<string>("MachineName")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<int?>("MachineStatus");

                    b.Property<string>("Model")
                        .HasMaxLength(50);

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<string>("Remark")
                        .HasMaxLength(200);

                    b.Property<int?>("TypeMachineId");

                    b.HasKey("MachineId");

                    b.HasIndex("TypeMachineId");

                    b.ToTable("Machines");
                });

            modelBuilder.Entity("VipcoMachine.Models.MachineHasOperator", b =>
                {
                    b.Property<int>("MachineOperatorId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("EmpCode");

                    b.Property<int?>("MachineId");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<string>("Remark")
                        .HasMaxLength(100);

                    b.HasKey("MachineOperatorId");

                    b.HasIndex("EmpCode");

                    b.HasIndex("MachineId");

                    b.ToTable("MachineHasOperator");
                });

            modelBuilder.Entity("VipcoMachine.Models.Material", b =>
                {
                    b.Property<int>("MaterialId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("Grade")
                        .HasMaxLength(200);

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<string>("Name")
                        .HasMaxLength(200);

                    b.Property<string>("Size")
                        .HasMaxLength(200);

                    b.HasKey("MaterialId");

                    b.ToTable("Material");
                });

            modelBuilder.Entity("VipcoMachine.Models.OverTimeDetail", b =>
                {
                    b.Property<int>("OverTimeDetailId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("EmpCode");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<int?>("OverTimeDetailStatus");

                    b.Property<int?>("OverTimeMasterId");

                    b.Property<string>("Remark")
                        .HasMaxLength(500);

                    b.Property<double>("TotalHour");

                    b.HasKey("OverTimeDetailId");

                    b.HasIndex("EmpCode");

                    b.HasIndex("OverTimeMasterId");

                    b.ToTable("OverTimeDetail");
                });

            modelBuilder.Entity("VipcoMachine.Models.OverTimeMaster", b =>
                {
                    b.Property<int>("OverTimeMasterId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("EmpApprove");

                    b.Property<string>("EmpRequire");

                    b.Property<string>("GroupCode");

                    b.Property<string>("GroupMIS");

                    b.Property<string>("InfoActual")
                        .HasMaxLength(500);

                    b.Property<string>("InfoPlan")
                        .HasMaxLength(500);

                    b.Property<int?>("LastOverTimeId");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<DateTime>("OverTimeDate");

                    b.Property<int?>("OverTimeStatus");

                    b.Property<int?>("ProjectCodeMasterId");

                    b.HasKey("OverTimeMasterId");

                    b.HasIndex("EmpApprove");

                    b.HasIndex("EmpRequire");

                    b.HasIndex("GroupCode");

                    b.HasIndex("GroupMIS");

                    b.HasIndex("LastOverTimeId");

                    b.HasIndex("ProjectCodeMasterId");

                    b.ToTable("OverTimeMaster");
                });

            modelBuilder.Entity("VipcoMachine.Models.ProjectCodeDetail", b =>
                {
                    b.Property<int>("ProjectCodeDetailId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("Description")
                        .HasMaxLength(200);

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<string>("ProjectCodeDetailCode")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int?>("ProjectCodeMasterId");

                    b.HasKey("ProjectCodeDetailId");

                    b.HasIndex("ProjectCodeMasterId");

                    b.ToTable("ProjectCodeDetail");
                });

            modelBuilder.Entity("VipcoMachine.Models.ProjectCodeMaster", b =>
                {
                    b.Property<int>("ProjectCodeMasterId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<DateTime?>("EndDate");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<string>("ProjectCode")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<string>("ProjectName")
                        .HasMaxLength(200);

                    b.Property<DateTime?>("StartDate");

                    b.HasKey("ProjectCodeMasterId");

                    b.ToTable("ProjectCodeMaster");
                });

            modelBuilder.Entity("VipcoMachine.Models.PropertyMachine", b =>
                {
                    b.Property<int>("PropertyMachineId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<int?>("MachineId");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<string>("PropertyName")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<string>("Remark")
                        .HasMaxLength(200);

                    b.Property<int?>("UnitsMeasureUnitMeasureId");

                    b.Property<double?>("Value");

                    b.HasKey("PropertyMachineId");

                    b.HasIndex("MachineId");

                    b.HasIndex("UnitsMeasureUnitMeasureId");

                    b.ToTable("PropertyMachine");
                });

            modelBuilder.Entity("VipcoMachine.Models.StandardTime", b =>
                {
                    b.Property<int>("StandardTimeId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("Description")
                        .HasMaxLength(250);

                    b.Property<int?>("GradeMaterialId");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<double?>("PreparationAfter");

                    b.Property<double?>("PreparationBefor");

                    b.Property<string>("Remark");

                    b.Property<string>("StandardTimeCode")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<double?>("StandardTimeValue");

                    b.Property<int?>("TypeStandardTimeId");

                    b.HasKey("StandardTimeId");

                    b.HasIndex("GradeMaterialId");

                    b.HasIndex("TypeStandardTimeId");

                    b.ToTable("StandardTime");
                });

            modelBuilder.Entity("VipcoMachine.Models.TaskMachine", b =>
                {
                    b.Property<int>("TaskMachineId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("ActualEndDate");

                    b.Property<double?>("ActualManHours");

                    b.Property<DateTime?>("ActualStartDate");

                    b.Property<string>("AssignedBy");

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<double?>("CurrentQuantity");

                    b.Property<string>("Description")
                        .HasMaxLength(200);

                    b.Property<int>("JobCardDetailId");

                    b.Property<int?>("MachineId");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<DateTime>("PlannedEndDate");

                    b.Property<DateTime>("PlannedStartDate");

                    b.Property<int?>("PrecedingTaskMachineId");

                    b.Property<int?>("Priority");

                    b.Property<string>("TaskMachineName")
                        .HasMaxLength(50);

                    b.Property<int?>("TaskMachineStatus");

                    b.Property<double?>("TotalQuantity");

                    b.HasKey("TaskMachineId");

                    b.HasIndex("AssignedBy");

                    b.HasIndex("JobCardDetailId");

                    b.HasIndex("MachineId");

                    b.HasIndex("PrecedingTaskMachineId");

                    b.ToTable("TaskMachine");
                });

            modelBuilder.Entity("VipcoMachine.Models.TaskMachineHasOverTime", b =>
                {
                    b.Property<int>("OverTimeId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("Description")
                        .HasMaxLength(200);

                    b.Property<string>("EmpCode");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<DateTime?>("OverTimeDate");

                    b.Property<double?>("OverTimePerDate");

                    b.Property<int?>("TaskMachineId");

                    b.HasKey("OverTimeId");

                    b.HasIndex("EmpCode");

                    b.HasIndex("TaskMachineId");

                    b.ToTable("TaskMachineHasOverTime");
                });

            modelBuilder.Entity("VipcoMachine.Models.TemplateProjectDetail", b =>
                {
                    b.Property<int>("TemplateProjectDetailId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<string>("TemplateName");

                    b.HasKey("TemplateProjectDetailId");

                    b.ToTable("TemplateProjectDetail");
                });

            modelBuilder.Entity("VipcoMachine.Models.TypeMachine", b =>
                {
                    b.Property<int>("TypeMachineId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("Description")
                        .HasMaxLength(200);

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<string>("Name")
                        .HasMaxLength(50);

                    b.Property<string>("Remark")
                        .HasMaxLength(200);

                    b.Property<string>("TypeMachineCode")
                        .HasMaxLength(25);

                    b.HasKey("TypeMachineId");

                    b.ToTable("TypeMachine");
                });

            modelBuilder.Entity("VipcoMachine.Models.TypeStandardTime", b =>
                {
                    b.Property<int>("TypeStandardTimeId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<int?>("TypeMachineId");

                    b.HasKey("TypeStandardTimeId");

                    b.HasIndex("TypeMachineId");

                    b.ToTable("TypeStandardTime");
                });

            modelBuilder.Entity("VipcoMachine.Models.UnitsMeasure", b =>
                {
                    b.Property<int>("UnitMeasureId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<string>("UnitMeasureName")
                        .IsRequired()
                        .HasMaxLength(25);

                    b.HasKey("UnitMeasureId");

                    b.ToTable("UnitsMeasure");
                });

            modelBuilder.Entity("VipcoMachine.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("EmpCode");

                    b.Property<int>("LevelUser");

                    b.Property<string>("MailAddress")
                        .HasMaxLength(100);

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<string>("PassWord")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.HasKey("UserId");

                    b.HasIndex("EmpCode");

                    b.ToTable("User");
                });

            modelBuilder.Entity("VipcoMachine.Models.CuttingPlan", b =>
                {
                    b.HasOne("VipcoMachine.Models.ProjectCodeDetail", "ProjectCodeDetail")
                        .WithMany("CuttingPlans")
                        .HasForeignKey("ProjectCodeDetailId");
                });

            modelBuilder.Entity("VipcoMachine.Models.Employee", b =>
                {
                    b.HasOne("VipcoMachine.Models.EmployeeGroupMIS", "EmployeeGroupMIS")
                        .WithMany("Employees")
                        .HasForeignKey("GroupMIS");
                });

            modelBuilder.Entity("VipcoMachine.Models.JobCardDetail", b =>
                {
                    b.HasOne("VipcoMachine.Models.CuttingPlan", "CuttingPlan")
                        .WithMany("JobCardDetails")
                        .HasForeignKey("CuttingPlanId");

                    b.HasOne("VipcoMachine.Models.JobCardMaster", "JobCardMaster")
                        .WithMany("JobCardDetails")
                        .HasForeignKey("JobCardMasterId");

                    b.HasOne("VipcoMachine.Models.StandardTime", "StandardTime")
                        .WithMany("JobCardDetails")
                        .HasForeignKey("StandardTimeId");

                    b.HasOne("VipcoMachine.Models.UnitsMeasure", "UnitsMeasure")
                        .WithMany("JobCardDetails")
                        .HasForeignKey("UnitMeasureId");
                });

            modelBuilder.Entity("VipcoMachine.Models.JobCardMaster", b =>
                {
                    b.HasOne("VipcoMachine.Models.Employee", "EmployeeRequire")
                        .WithMany()
                        .HasForeignKey("EmpRequire");

                    b.HasOne("VipcoMachine.Models.Employee", "EmployeeWrite")
                        .WithMany()
                        .HasForeignKey("EmpWrite");

                    b.HasOne("VipcoMachine.Models.EmployeeGroup", "EmployeeGroup")
                        .WithMany("JobCardMasters")
                        .HasForeignKey("GroupCode");

                    b.HasOne("VipcoMachine.Models.ProjectCodeDetail", "ProjectCodeDetail")
                        .WithMany("JobCardMasters")
                        .HasForeignKey("ProjectCodeDetailId");

                    b.HasOne("VipcoMachine.Models.TypeMachine", "TypeMachine")
                        .WithMany("JobCardMasters")
                        .HasForeignKey("TypeMachineId");
                });

            modelBuilder.Entity("VipcoMachine.Models.JobCardMasterHasAttach", b =>
                {
                    b.HasOne("VipcoMachine.Models.AttachFile", "AttachFile")
                        .WithMany("JobCardMasterHasAttachs")
                        .HasForeignKey("AttachFileId");

                    b.HasOne("VipcoMachine.Models.JobCardMaster", "JobCardMaster")
                        .WithMany("JobCardMasterHasAttachs")
                        .HasForeignKey("JobCardMasterId");
                });

            modelBuilder.Entity("VipcoMachine.Models.Machine", b =>
                {
                    b.HasOne("VipcoMachine.Models.TypeMachine", "TypeMachine")
                        .WithMany("Machines")
                        .HasForeignKey("TypeMachineId");
                });

            modelBuilder.Entity("VipcoMachine.Models.MachineHasOperator", b =>
                {
                    b.HasOne("VipcoMachine.Models.Employee", "Employee")
                        .WithMany("MachineHasOperators")
                        .HasForeignKey("EmpCode");

                    b.HasOne("VipcoMachine.Models.Machine", "Machine")
                        .WithMany("MachineHasOperators")
                        .HasForeignKey("MachineId");
                });

            modelBuilder.Entity("VipcoMachine.Models.OverTimeDetail", b =>
                {
                    b.HasOne("VipcoMachine.Models.Employee", "Employee")
                        .WithMany("OverTimeDetails")
                        .HasForeignKey("EmpCode");

                    b.HasOne("VipcoMachine.Models.OverTimeMaster", "OverTimeMaster")
                        .WithMany("OverTimeDetails")
                        .HasForeignKey("OverTimeMasterId");
                });

            modelBuilder.Entity("VipcoMachine.Models.OverTimeMaster", b =>
                {
                    b.HasOne("VipcoMachine.Models.Employee", "ApproveBy")
                        .WithMany()
                        .HasForeignKey("EmpApprove");

                    b.HasOne("VipcoMachine.Models.Employee", "RequireBy")
                        .WithMany()
                        .HasForeignKey("EmpRequire");

                    b.HasOne("VipcoMachine.Models.EmployeeGroup", "EmployeeGroup")
                        .WithMany("OverTimeMasters")
                        .HasForeignKey("GroupCode");

                    b.HasOne("VipcoMachine.Models.EmployeeGroupMIS", "EmployeeGroupMIS")
                        .WithMany("OverTimeMasters")
                        .HasForeignKey("GroupMIS");

                    b.HasOne("VipcoMachine.Models.OverTimeMaster", "LastOverTimeMaster")
                        .WithMany()
                        .HasForeignKey("LastOverTimeId");

                    b.HasOne("VipcoMachine.Models.ProjectCodeMaster", "ProjectCodeMaster")
                        .WithMany("OverTimeMasters")
                        .HasForeignKey("ProjectCodeMasterId");
                });

            modelBuilder.Entity("VipcoMachine.Models.ProjectCodeDetail", b =>
                {
                    b.HasOne("VipcoMachine.Models.ProjectCodeMaster", "ProjectCodeMaster")
                        .WithMany("ProjectCodeDetails")
                        .HasForeignKey("ProjectCodeMasterId");
                });

            modelBuilder.Entity("VipcoMachine.Models.PropertyMachine", b =>
                {
                    b.HasOne("VipcoMachine.Models.Machine", "Machine")
                        .WithMany("PropertyMachines")
                        .HasForeignKey("MachineId");

                    b.HasOne("VipcoMachine.Models.UnitsMeasure")
                        .WithMany("PropertyMachines")
                        .HasForeignKey("UnitsMeasureUnitMeasureId");
                });

            modelBuilder.Entity("VipcoMachine.Models.StandardTime", b =>
                {
                    b.HasOne("VipcoMachine.Models.GradeMaterial", "GradeMaterial")
                        .WithMany("StandardTimes")
                        .HasForeignKey("GradeMaterialId");

                    b.HasOne("VipcoMachine.Models.TypeStandardTime", "TypeStandardTime")
                        .WithMany("StandardTimes")
                        .HasForeignKey("TypeStandardTimeId");
                });

            modelBuilder.Entity("VipcoMachine.Models.TaskMachine", b =>
                {
                    b.HasOne("VipcoMachine.Models.Employee", "Employee")
                        .WithMany("TaskMachines")
                        .HasForeignKey("AssignedBy");

                    b.HasOne("VipcoMachine.Models.JobCardDetail", "JobCardDetail")
                        .WithMany()
                        .HasForeignKey("JobCardDetailId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("VipcoMachine.Models.Machine", "Machine")
                        .WithMany("TaskMachines")
                        .HasForeignKey("MachineId");

                    b.HasOne("VipcoMachine.Models.TaskMachine", "PrecedingTaskMachine")
                        .WithMany()
                        .HasForeignKey("PrecedingTaskMachineId");
                });

            modelBuilder.Entity("VipcoMachine.Models.TaskMachineHasOverTime", b =>
                {
                    b.HasOne("VipcoMachine.Models.Employee", "Employee")
                        .WithMany("TaskMachineHasOverTimes")
                        .HasForeignKey("EmpCode");

                    b.HasOne("VipcoMachine.Models.TaskMachine", "TaskMachine")
                        .WithMany("TaskMachineHasOverTimes")
                        .HasForeignKey("TaskMachineId");
                });

            modelBuilder.Entity("VipcoMachine.Models.TypeStandardTime", b =>
                {
                    b.HasOne("VipcoMachine.Models.TypeMachine", "TypeMachine")
                        .WithMany("TypeStandardTimes")
                        .HasForeignKey("TypeMachineId");
                });

            modelBuilder.Entity("VipcoMachine.Models.User", b =>
                {
                    b.HasOne("VipcoMachine.Models.Employee", "Employee")
                        .WithMany("Users")
                        .HasForeignKey("EmpCode");
                });
#pragma warning restore 612, 618
        }
    }
}
