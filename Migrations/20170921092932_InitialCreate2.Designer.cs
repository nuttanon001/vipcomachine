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
    [Migration("20170921092932_InitialCreate2")]
    partial class InitialCreate2
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
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

                    b.Property<int?>("MaterialId");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<int?>("ProjectCodeDetailId");

                    b.HasKey("CuttingPlanId");

                    b.HasIndex("MaterialId");

                    b.HasIndex("ProjectCodeDetailId");

                    b.ToTable("CuttingPlan");
                });

            modelBuilder.Entity("VipcoMachine.Models.Employee", b =>
                {
                    b.Property<string>("EmpCode")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("NameEng")
                        .HasMaxLength(100);

                    b.Property<string>("NameThai")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Title")
                        .HasMaxLength(20);

                    b.Property<int?>("TypeEmployee");

                    b.HasKey("EmpCode");

                    b.ToTable("Employee");
                });

            modelBuilder.Entity("VipcoMachine.Models.GradeMaterial", b =>
                {
                    b.Property<int>("GradeMaterialId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("GradeCode")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<string>("GradeSubCode")
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

                    b.Property<int?>("MaterialId");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<int?>("ProjectCodeDetailId");

                    b.Property<double?>("Quality");

                    b.Property<string>("Remark")
                        .HasMaxLength(200);

                    b.Property<int?>("UnitMeasureId");

                    b.HasKey("JobCardDetailId");

                    b.HasIndex("CuttingPlanId");

                    b.HasIndex("JobCardMasterId");

                    b.HasIndex("MaterialId");

                    b.HasIndex("ProjectCodeDetailId");

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

                    b.Property<DateTime?>("JobCardDate");

                    b.Property<string>("JobCardMasterNo")
                        .HasMaxLength(50);

                    b.Property<int?>("JobCardMasterStatus");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<int?>("ProjectCodeMasterId");

                    b.Property<string>("Remark")
                        .HasMaxLength(200);

                    b.HasKey("JobCardMasterId");

                    b.HasIndex("EmpRequire");

                    b.HasIndex("EmpWrite");

                    b.HasIndex("ProjectCodeMasterId");

                    b.ToTable("JobCardMaster");
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

                    b.Property<int?>("ClassificationId");

                    b.Property<DateTime?>("CreateDate");

                    b.Property<string>("Creator");

                    b.Property<string>("Description")
                        .HasMaxLength(200);

                    b.Property<int?>("GradeMaterialId");

                    b.Property<double?>("Length");

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<double?>("SquareMeter");

                    b.Property<double?>("Thickness");

                    b.Property<int?>("TypeStandardTimeId");

                    b.Property<double?>("Weight");

                    b.Property<double?>("Width");

                    b.HasKey("MaterialId");

                    b.HasIndex("ClassificationId");

                    b.HasIndex("GradeMaterialId");

                    b.HasIndex("TypeStandardTimeId");

                    b.ToTable("Material");
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
                        .HasMaxLength(150);

                    b.Property<int?>("MaterialId");

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

                    b.HasIndex("MaterialId")
                        .IsUnique()
                        .HasFilter("[MaterialId] IS NOT NULL");

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

                    b.Property<double?>("TotalQuantity");

                    b.HasKey("TaskMachineId");

                    b.HasIndex("AssignedBy");

                    b.HasIndex("JobCardDetailId")
                        .IsUnique();

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

                    b.Property<DateTime?>("ModifyDate");

                    b.Property<string>("Modifyer");

                    b.Property<DateTime?>("OverTimeEnd");

                    b.Property<double?>("OverTimePerDate");

                    b.Property<DateTime?>("OverTimeStart");

                    b.Property<int?>("TaskMachineId");

                    b.HasKey("OverTimeId");

                    b.HasIndex("TaskMachineId")
                        .IsUnique()
                        .HasFilter("[TaskMachineId] IS NOT NULL");

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

                    b.Property<string>("SubName");

                    b.HasKey("TypeStandardTimeId");

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
                    b.HasOne("VipcoMachine.Models.Material", "Material")
                        .WithMany("CuttingPlans")
                        .HasForeignKey("MaterialId");

                    b.HasOne("VipcoMachine.Models.ProjectCodeDetail", "ProjectCodeDetail")
                        .WithMany("CuttingPlans")
                        .HasForeignKey("ProjectCodeDetailId");
                });

            modelBuilder.Entity("VipcoMachine.Models.JobCardDetail", b =>
                {
                    b.HasOne("VipcoMachine.Models.CuttingPlan", "CuttingPlan")
                        .WithMany("JobCardDetails")
                        .HasForeignKey("CuttingPlanId");

                    b.HasOne("VipcoMachine.Models.JobCardMaster", "JobCardMaster")
                        .WithMany("JobCardDetails")
                        .HasForeignKey("JobCardMasterId");

                    b.HasOne("VipcoMachine.Models.Material", "Material")
                        .WithMany("JobCardDetails")
                        .HasForeignKey("MaterialId");

                    b.HasOne("VipcoMachine.Models.ProjectCodeDetail", "ProjectCodeDetail")
                        .WithMany()
                        .HasForeignKey("ProjectCodeDetailId");

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

                    b.HasOne("VipcoMachine.Models.ProjectCodeMaster", "ProjectCodeMaster")
                        .WithMany("JobCardMasters")
                        .HasForeignKey("ProjectCodeMasterId");
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

            modelBuilder.Entity("VipcoMachine.Models.Material", b =>
                {
                    b.HasOne("VipcoMachine.Models.ClassificationMaterial", "ClassificationMaterial")
                        .WithMany("Materials")
                        .HasForeignKey("ClassificationId");

                    b.HasOne("VipcoMachine.Models.GradeMaterial", "GradeMaterial")
                        .WithMany("Materials")
                        .HasForeignKey("GradeMaterialId");

                    b.HasOne("VipcoMachine.Models.TypeStandardTime", "TypeStandardTime")
                        .WithMany("Materials")
                        .HasForeignKey("TypeStandardTimeId");
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
                    b.HasOne("VipcoMachine.Models.Material", "Material")
                        .WithOne("StandardTime")
                        .HasForeignKey("VipcoMachine.Models.StandardTime", "MaterialId");

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
                        .WithOne("TaskMachine")
                        .HasForeignKey("VipcoMachine.Models.TaskMachine", "JobCardDetailId")
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
                    b.HasOne("VipcoMachine.Models.TaskMachine", "TaskMachine")
                        .WithOne("TaskMachineHasOverTime")
                        .HasForeignKey("VipcoMachine.Models.TaskMachineHasOverTime", "TaskMachineId");
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
