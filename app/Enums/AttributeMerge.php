<?php

namespace App\Enums;

enum AttributeMerge: string
{
    public const string MERGE = "merge";
    public const string OVERRIDE = "override";
    public const string TRAITONLY = "trait-only";
}
